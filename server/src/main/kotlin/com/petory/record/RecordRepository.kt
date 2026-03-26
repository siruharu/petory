package com.petory.record

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface RecordRepository : JpaRepository<RecordEntity, UUID> {
    fun findAllByUserIdOrderByOccurredAtDesc(userId: UUID): List<RecordEntity>
    fun findAllByUserIdAndPetIdOrderByOccurredAtDesc(userId: UUID, petId: UUID): List<RecordEntity>
    fun findAllByUserIdAndPetIdAndTypeOrderByOccurredAtDesc(userId: UUID, petId: UUID, type: RecordType): List<RecordEntity>
    fun findByIdAndUserId(id: UUID, userId: UUID): RecordEntity?
    fun findTop3ByUserIdAndPetIdOrderByOccurredAtDesc(userId: UUID, petId: UUID): List<RecordEntity>
}
