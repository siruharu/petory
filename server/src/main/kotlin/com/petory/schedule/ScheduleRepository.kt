package com.petory.schedule

import org.springframework.data.jpa.repository.JpaRepository
import java.time.OffsetDateTime
import java.util.UUID

interface ScheduleRepository : JpaRepository<ScheduleEntity, UUID> {
    fun findAllByUserIdOrderByDueAtAsc(userId: UUID): List<ScheduleEntity>
    fun findAllByUserIdAndPetIdOrderByDueAtAsc(userId: UUID, petId: UUID): List<ScheduleEntity>
    fun findByIdAndUserId(id: UUID, userId: UUID): ScheduleEntity?
    fun findAllByUserIdAndDueAtLessThanEqualOrderByDueAtAsc(userId: UUID, beforeOrEqual: OffsetDateTime): List<ScheduleEntity>
    fun findAllByUserIdAndPetIdAndDueAtLessThanEqualOrderByDueAtAsc(
        userId: UUID,
        petId: UUID,
        beforeOrEqual: OffsetDateTime,
    ): List<ScheduleEntity>
}
