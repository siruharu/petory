package com.petory.pet

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate
import java.util.UUID

@Entity
@Table(name = "pets")
class PetEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(name = "user_id", nullable = false)
    val userId: UUID,

    @Column(nullable = false)
    var name: String,

    @Column(nullable = false)
    var species: String,

    @Column
    var breed: String? = null,

    @Column
    var sex: String? = null,

    @Column(name = "neutered_status")
    var neuteredStatus: String? = null,

    @Column(name = "birth_date")
    var birthDate: LocalDate? = null,

    @Column(name = "age_text")
    var ageText: String? = null,

    @Column
    var weight: BigDecimal? = null,

    @Column
    var note: String? = null,

    @Column(name = "photo_url")
    var photoUrl: String? = null,

    @Column(name = "created_at", nullable = false)
    val createdAt: Instant = Instant.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),
)
