package com.petory.dashboard

import com.petory.pet.PetEntity
import com.petory.pet.PetRepository
import com.petory.record.RecordRepository
import com.petory.schedule.ScheduleEntity
import com.petory.schedule.ScheduleRepository
import com.petory.schedule.ScheduleService
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.OffsetDateTime
import java.util.UUID

@Service
class DashboardService(
    private val petRepository: PetRepository,
    private val scheduleRepository: ScheduleRepository,
    private val recordRepository: RecordRepository,
    private val scheduleService: ScheduleService,
) {
    @Transactional(readOnly = true)
    fun getHome(userId: UUID, petId: String?): HomeDashboardResponse {
        val pets = petRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
        val selectedPetId = petId?.takeIf { it.isNotBlank() }?.toUuid("Selected pet id is invalid")
        val selectedPet = pets.firstOrNull { it.id == selectedPetId } ?: pets.firstOrNull()
        val now = OffsetDateTime.now()
        val schedules = selectedPet?.let {
            scheduleRepository.findAllByUserIdAndPetIdOrderByDueAtAsc(userId, it.id)
        } ?: emptyList()
        val todaySchedules = schedules
            .filter { scheduleService.isToday(it, now) && !scheduleService.isOverdue(it, now) }
            .map { toDashboardScheduleResponse(it, now) }
        val overdueSchedules = schedules
            .filter { scheduleService.isOverdue(it, now) }
            .map { toDashboardScheduleResponse(it, now) }
        val recentRecords = selectedPet?.let {
            recordRepository.findTop3ByUserIdAndPetIdOrderByOccurredAtDesc(userId, it.id)
        }?.map(::toDashboardRecordResponse) ?: emptyList()

        return HomeDashboardResponse(
            selectedPet = selectedPet?.let(::toDashboardPetResponse),
            pets = pets.map(::toDashboardPetResponse),
            todaySchedules = todaySchedules,
            overdueSchedules = overdueSchedules,
            recentRecords = recentRecords,
        )
    }

    private fun toDashboardPetResponse(entity: PetEntity): DashboardPetResponse =
        DashboardPetResponse(
            id = entity.id.toString(),
            name = entity.name,
            species = entity.species,
            breed = entity.breed,
            sex = entity.sex,
            neuteredStatus = entity.neuteredStatus,
            birthDate = entity.birthDate?.toString(),
            ageText = entity.ageText,
            weight = entity.weight?.toDouble(),
            note = entity.note,
            photoUrl = entity.photoUrl,
        )

    private fun toDashboardScheduleResponse(entity: ScheduleEntity, now: OffsetDateTime): DashboardScheduleResponse =
        DashboardScheduleResponse(
            id = entity.id.toString(),
            petId = entity.petId.toString(),
            type = entity.type.name.lowercase(),
            title = entity.title,
            note = entity.note,
            dueAt = entity.dueAt.toString(),
            recurrenceType = entity.recurrenceType.name.lowercase(),
            status = when {
                entity.completedAt != null -> "completed"
                scheduleService.isOverdue(entity, now) -> "overdue"
                else -> "scheduled"
            },
            completedAt = entity.completedAt?.toString(),
        )

    private fun toDashboardRecordResponse(entity: com.petory.record.RecordEntity): DashboardRecordResponse =
        DashboardRecordResponse(
            id = entity.id.toString(),
            petId = entity.petId.toString(),
            type = entity.type.name.lowercase(),
            title = entity.title,
            note = entity.note,
            occurredAt = entity.occurredAt.toString(),
            value = entity.measurementValue?.toDouble(),
            unit = entity.unit,
            sourceScheduleId = entity.sourceScheduleId?.toString(),
        )

    private fun String.toUuid(message: String): UUID =
        try {
            UUID.fromString(this)
        } catch (_: IllegalArgumentException) {
            throw IllegalArgumentException(message)
        }
}
