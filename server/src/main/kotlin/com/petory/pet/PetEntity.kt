package com.petory.pet

import java.math.BigDecimal
import java.time.LocalDate
import java.time.OffsetDateTime
import java.util.UUID

/**
 * Pet domain model for MVP persistence shape.
 * One user can own multiple pets.
 */
data class PetEntity(
    val id: UUID = UUID.randomUUID(),
    val userId: UUID,
    val name: String,
    val species: String,
    val breed: String? = null,
    val sex: String? = null,
    val neuteredStatus: String? = null,
    val birthDate: LocalDate? = null,
    val ageText: String? = null,
    val weight: BigDecimal? = null,
    val note: String? = null,
    val photoUrl: String? = null,
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
    val updatedAt: OffsetDateTime = OffsetDateTime.now(),
)

