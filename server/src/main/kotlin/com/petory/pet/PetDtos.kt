package com.petory.pet

data class CreatePetRequest(
    val name: String,
    val species: String,
    val breed: String? = null,
    val sex: String? = null,
    val neuteredStatus: String? = null,
    val birthDate: String? = null,
    val ageText: String? = null,
    val weight: Double? = null,
    val note: String? = null,
    val photoUrl: String? = null,
)

data class UpdatePetRequest(
    val name: String? = null,
    val species: String? = null,
    val breed: String? = null,
    val sex: String? = null,
    val neuteredStatus: String? = null,
    val birthDate: String? = null,
    val ageText: String? = null,
    val weight: Double? = null,
    val note: String? = null,
    val photoUrl: String? = null,
)

data class PetResponse(
    val id: String,
    val name: String,
    val species: String,
    val breed: String? = null,
    val sex: String? = null,
    val neuteredStatus: String? = null,
    val birthDate: String? = null,
    val ageText: String? = null,
    val weight: Double? = null,
    val note: String? = null,
    val photoUrl: String? = null,
)

