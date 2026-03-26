package com.petory.schedule

import com.petory.notification.NotificationService
import com.petory.pet.PetRepository
import com.petory.record.RecordService
import com.petory.record.RecordType
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.OffsetDateTime
import java.util.UUID

@Service
class ScheduleService(
    private val scheduleRepository: ScheduleRepository,
    private val petRepository: PetRepository,
    private val recordService: RecordService,
    private val notificationService: NotificationService,
) {
    @Transactional(readOnly = true)
    fun getSchedules(
        userId: UUID,
        petId: String?,
        filters: ScheduleFilters = ScheduleFilters(),
    ): List<ScheduleResponse> {
        val resolvedPetId = petId?.takeIf { it.isNotBlank() }?.toUuid("Pet id is invalid")
        val now = OffsetDateTime.now()
        val from = filters.from?.takeIf { it.isNotBlank() }?.let(::parseOffsetDateTime)
        val to = filters.to?.takeIf { it.isNotBlank() }?.let(::parseOffsetDateTime)
        val statusFilter = filters.status?.takeIf { it.isNotBlank() }?.lowercase()

        val schedules = if (resolvedPetId != null) {
            petRepository.findByIdAndUserId(resolvedPetId, userId)
                ?: throw NoSuchElementException("Pet was not found")
            scheduleRepository.findAllByUserIdAndPetIdOrderByDueAtAsc(userId, resolvedPetId)
        } else {
            scheduleRepository.findAllByUserIdOrderByDueAtAsc(userId)
        }

        return schedules
            .map { toResponse(it, now) }
            .filter { response ->
                matchesStatusFilter(response, statusFilter) &&
                    matchesRangeFilter(response, from, to)
            }
    }

    @Transactional
    fun createSchedule(userId: UUID, request: CreateScheduleRequest): ScheduleResponse {
        require(request.petId.isNotBlank()) { "Pet id is required" }
        require(request.type.isNotBlank()) { "Schedule type is required" }
        require(request.title.isNotBlank()) { "Schedule title is required" }
        require(request.dueAt.isNotBlank()) { "Due at is required" }

        val petId = request.petId.toUuid("Pet id is invalid")
        petRepository.findByIdAndUserId(petId, userId)
            ?: throw NoSuchElementException("Pet was not found")

        val savedSchedule = scheduleRepository.save(
            ScheduleEntity(
                userId = userId,
                petId = petId,
                type = request.type.toScheduleType(),
                title = request.title.trim(),
                note = request.note?.trim()?.ifBlank { null },
                dueAt = parseOffsetDateTime(request.dueAt),
                recurrenceType = request.recurrenceType.toRecurrenceType(),
                status = ScheduleStatus.SCHEDULED,
                completedAt = null,
            ),
        )

        notificationService.scheduleJob(
            userId = userId,
            scheduleId = savedSchedule.id,
            sendAt = savedSchedule.dueAt,
        )

        return toResponse(savedSchedule, OffsetDateTime.now())
    }

    @Transactional
    fun completeSchedule(
        userId: UUID,
        scheduleId: String,
        request: CompleteScheduleRequest,
    ): CompleteScheduleResponse {
        val scheduleEntity = scheduleRepository.findByIdAndUserId(
            scheduleId.toUuid("Schedule id is invalid"),
            userId,
        ) ?: throw NoSuchElementException("Schedule was not found")

        if (scheduleEntity.status == ScheduleStatus.COMPLETED) {
            throw IllegalArgumentException("Schedule is already completed")
        }

        val completedAt = request.completedAt?.takeIf { it.isNotBlank() }?.let(::parseOffsetDateTime)
            ?: OffsetDateTime.now()

        val completedSchedule = scheduleRepository.save(
            scheduleEntity.copy(
                status = ScheduleStatus.COMPLETED,
                completedAt = completedAt,
            ),
        )

        notificationService.cancelPendingJobs(completedSchedule.id)

        val completedRecord = if (request.createRecord) {
            val recordType = completedSchedule.type.toRecordType()
            recordService.createScheduledRecord(
                userId = userId,
                petId = completedSchedule.petId,
                type = recordType,
                title = completedSchedule.title,
                note = completedSchedule.note,
                occurredAt = completedAt,
                sourceScheduleId = completedSchedule.id,
            )
        } else {
            null
        }

        val nextSchedule = buildNextSchedule(completedSchedule, completedAt)?.let { nextEntity ->
            val savedNextSchedule = scheduleRepository.save(nextEntity)
            notificationService.scheduleJob(
                userId = userId,
                scheduleId = savedNextSchedule.id,
                sendAt = savedNextSchedule.dueAt,
            )
            savedNextSchedule
        }

        val now = OffsetDateTime.now()
        return CompleteScheduleResponse(
            schedule = toResponse(completedSchedule, now),
            record = completedRecord?.let {
                CompletedScheduleRecordResponse(
                    id = it.id,
                    petId = it.petId,
                    type = it.type,
                    title = it.title,
                    note = it.note,
                    occurredAt = it.occurredAt,
                    value = it.value,
                    unit = it.unit,
                    sourceScheduleId = it.sourceScheduleId,
                )
            },
            nextSchedule = nextSchedule?.let { toResponse(it, now) },
        )
    }

    fun isOverdue(schedule: ScheduleEntity, now: OffsetDateTime): Boolean =
        schedule.completedAt == null && schedule.dueAt.isBefore(now)

    fun isToday(schedule: ScheduleEntity, now: OffsetDateTime): Boolean {
        if (schedule.completedAt != null) {
            return false
        }

        val today = now.toLocalDate()
        return schedule.dueAt.toLocalDate() == today
    }

    private fun buildNextSchedule(
        completedSchedule: ScheduleEntity,
        completedAt: OffsetDateTime,
    ): ScheduleEntity? {
        if (completedSchedule.recurrenceType == RecurrenceType.NONE) {
            return null
        }

        var nextDueAt = nextDueAt(completedSchedule.dueAt, completedSchedule.recurrenceType)
        while (nextDueAt.isBefore(completedAt)) {
            nextDueAt = nextDueAt(nextDueAt, completedSchedule.recurrenceType)
        }

        return ScheduleEntity(
            userId = completedSchedule.userId,
            petId = completedSchedule.petId,
            type = completedSchedule.type,
            title = completedSchedule.title,
            note = completedSchedule.note,
            dueAt = nextDueAt,
            recurrenceType = completedSchedule.recurrenceType,
            status = ScheduleStatus.SCHEDULED,
            completedAt = null,
        )
    }

    private fun nextDueAt(dueAt: OffsetDateTime, recurrenceType: RecurrenceType): OffsetDateTime =
        when (recurrenceType) {
            RecurrenceType.NONE -> dueAt
            RecurrenceType.DAILY -> dueAt.plusDays(1)
            RecurrenceType.WEEKLY -> dueAt.plusWeeks(1)
            RecurrenceType.MONTHLY -> dueAt.plusMonths(1)
        }

    private fun matchesStatusFilter(response: ScheduleResponse, statusFilter: String?): Boolean {
        if (statusFilter == null) {
            return true
        }

        return response.status == statusFilter
    }

    private fun matchesRangeFilter(
        response: ScheduleResponse,
        from: OffsetDateTime?,
        to: OffsetDateTime?,
    ): Boolean {
        val dueAt = parseOffsetDateTime(response.dueAt)
        val afterFrom = from == null || !dueAt.isBefore(from)
        val beforeTo = to == null || !dueAt.isAfter(to)
        return afterFrom && beforeTo
    }

    private fun parseOffsetDateTime(value: String): OffsetDateTime =
        try {
            OffsetDateTime.parse(value)
        } catch (_: Exception) {
            throw IllegalArgumentException("Datetime must be in ISO-8601 format")
        }

    private fun String.toUuid(message: String): UUID =
        try {
            UUID.fromString(this)
        } catch (_: IllegalArgumentException) {
            throw IllegalArgumentException(message)
        }

    private fun String.toScheduleType(): ScheduleType =
        try {
            ScheduleType.valueOf(trim().uppercase())
        } catch (_: IllegalArgumentException) {
            throw IllegalArgumentException("Schedule type is invalid")
        }

    private fun String.toRecurrenceType(): RecurrenceType =
        try {
            RecurrenceType.valueOf(trim().uppercase())
        } catch (_: IllegalArgumentException) {
            throw IllegalArgumentException("Recurrence type is invalid")
        }

    private fun ScheduleType.toRecordType(): RecordType =
        when (this) {
            ScheduleType.VACCINATION -> RecordType.VACCINATION
            ScheduleType.MEDICATION -> RecordType.MEDICATION
            ScheduleType.PREVENTION -> RecordType.MEMO
            ScheduleType.VET_VISIT -> RecordType.VET_VISIT_MEMO
            ScheduleType.CUSTOM -> RecordType.MEMO
        }

    private fun toResponse(entity: ScheduleEntity, now: OffsetDateTime): ScheduleResponse {
        val status = if (entity.status == ScheduleStatus.COMPLETED) {
            ScheduleStatus.COMPLETED
        } else if (isOverdue(entity, now)) {
            ScheduleStatus.OVERDUE
        } else {
            ScheduleStatus.SCHEDULED
        }

        return ScheduleResponse(
            id = entity.id.toString(),
            petId = entity.petId.toString(),
            type = entity.type.name.lowercase(),
            title = entity.title,
            note = entity.note,
            dueAt = entity.dueAt.toString(),
            recurrenceType = entity.recurrenceType.name.lowercase(),
            status = status.name.lowercase(),
            completedAt = entity.completedAt?.toString(),
        )
    }
}
