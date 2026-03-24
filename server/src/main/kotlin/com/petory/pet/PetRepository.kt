package com.petory.pet

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface PetRepository : JpaRepository<PetEntity, UUID> {
    fun findAllByUserIdOrderByCreatedAtDesc(userId: UUID): List<PetEntity>
    fun findByIdAndUserId(id: UUID, userId: UUID): PetEntity?
}
