package com.petory.pet

import org.springframework.stereotype.Service
import java.util.UUID

@Service
class PetService {
    fun getPets(): List<PetResponse> = emptyList()

    fun createPet(request: CreatePetRequest): PetResponse =
        PetResponse(
            id = UUID.randomUUID().toString(),
            name = request.name,
            species = request.species,
            breed = request.breed,
            sex = request.sex,
            neuteredStatus = request.neuteredStatus,
            birthDate = request.birthDate,
            ageText = request.ageText,
            weight = request.weight,
            note = request.note,
            photoUrl = request.photoUrl,
        )

    fun updatePet(petId: String, request: UpdatePetRequest): PetResponse =
        PetResponse(
            id = petId,
            name = request.name ?: "TODO_NAME",
            species = request.species ?: "dog",
            breed = request.breed,
            sex = request.sex,
            neuteredStatus = request.neuteredStatus,
            birthDate = request.birthDate,
            ageText = request.ageText,
            weight = request.weight,
            note = request.note,
            photoUrl = request.photoUrl,
        )
}
