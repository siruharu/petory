package com.petory.pet

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

@Service
class PetService(
    private val petRepository: PetRepository,
) {
    @Transactional(readOnly = true)
    fun getPets(userId: UUID): List<PetResponse> =
        petRepository.findAllByUserIdOrderByCreatedAtDesc(userId).map(::toResponse)

    @Transactional
    fun createPet(userId: UUID, request: CreatePetRequest): PetResponse {
        require(request.name.isNotBlank()) { "Pet name is required" }
        require(request.species.isNotBlank()) { "Pet species is required" }

        val savedPet = petRepository.save(
            PetEntity(
                userId = userId,
                name = request.name.trim(),
                species = request.species.trim(),
                breed = request.breed?.trim()?.ifBlank { null },
                sex = request.sex?.trim()?.ifBlank { null },
                neuteredStatus = request.neuteredStatus?.trim()?.ifBlank { null },
                birthDate = parseBirthDate(request.birthDate),
                ageText = request.ageText?.trim()?.ifBlank { null },
                weight = request.weight?.toBigDecimal(),
                note = request.note?.trim()?.ifBlank { null },
                photoUrl = request.photoUrl?.trim()?.ifBlank { null },
            ),
        )

        return toResponse(savedPet)
    }

    @Transactional
    fun updatePet(userId: UUID, petId: UUID, request: UpdatePetRequest): PetResponse {
        val pet = petRepository.findByIdAndUserId(petId, userId)
            ?: throw NoSuchElementException("Pet was not found")

        request.name?.let {
            require(it.isNotBlank()) { "Pet name is required" }
            pet.name = it.trim()
        }

        request.species?.let {
            require(it.isNotBlank()) { "Pet species is required" }
            pet.species = it.trim()
        }

        pet.breed = request.breed?.trim()?.ifBlank { null } ?: pet.breed
        pet.sex = request.sex?.trim()?.ifBlank { null } ?: pet.sex
        pet.neuteredStatus = request.neuteredStatus?.trim()?.ifBlank { null } ?: pet.neuteredStatus
        pet.birthDate = request.birthDate?.let(::parseBirthDate) ?: pet.birthDate
        pet.ageText = request.ageText?.trim()?.ifBlank { null } ?: pet.ageText
        pet.weight = request.weight?.toBigDecimal() ?: pet.weight
        pet.note = request.note?.trim()?.ifBlank { null } ?: pet.note
        pet.photoUrl = request.photoUrl?.trim()?.ifBlank { null } ?: pet.photoUrl
        pet.updatedAt = Instant.now()

        return toResponse(petRepository.save(pet))
    }

    private fun parseBirthDate(value: String?): LocalDate? {
        val normalized = value?.trim()?.ifBlank { null } ?: return null
        return try {
            LocalDate.parse(normalized)
        } catch (_: Exception) {
            throw IllegalArgumentException("Birth date must be in yyyy-MM-dd format")
        }
    }

    private fun toResponse(entity: PetEntity): PetResponse =
        PetResponse(
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
}
