package com.petory.pet

import java.util.UUID

interface PetRepository {
    fun findAllByUserId(userId: UUID): List<PetEntity>
    fun findByIdAndUserId(id: UUID, userId: UUID): PetEntity?
    fun save(pet: PetEntity): PetEntity
}

