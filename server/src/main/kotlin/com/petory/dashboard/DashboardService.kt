package com.petory.dashboard

import com.petory.pet.PetEntity
import com.petory.pet.PetRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class DashboardService(
    private val petRepository: PetRepository,
) {
    @Transactional(readOnly = true)
    fun getHome(userId: UUID, petId: String?): HomeDashboardResponse {
        val pets = petRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
        val selectedPetId = petId?.takeIf { it.isNotBlank() }?.toUuid("Selected pet id is invalid")
        val selectedPet = pets.firstOrNull { it.id == selectedPetId } ?: pets.firstOrNull()

        return HomeDashboardResponse(
            selectedPet = selectedPet?.let(::toDashboardPetResponse),
            pets = pets.map(::toDashboardPetResponse),
            todaySchedules = emptyList(),
            overdueSchedules = emptyList(),
            recentRecords = emptyList(),
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

    private fun String.toUuid(message: String): UUID =
        try {
            UUID.fromString(this)
        } catch (_: IllegalArgumentException) {
            throw IllegalArgumentException(message)
        }
}
