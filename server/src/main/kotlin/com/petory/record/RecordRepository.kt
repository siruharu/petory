package com.petory.record

import java.util.UUID

interface RecordRepository {
    fun findAllByUserId(userId: UUID): List<RecordEntity>
    fun findAllByUserIdAndPetId(userId: UUID, petId: UUID): List<RecordEntity>
    fun findAllByUserIdAndPetIdAndType(userId: UUID, petId: UUID, type: RecordType): List<RecordEntity>
    fun findByIdAndUserId(id: UUID, userId: UUID): RecordEntity?
    fun save(record: RecordEntity): RecordEntity
}

