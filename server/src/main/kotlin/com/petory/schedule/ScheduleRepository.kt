package com.petory.schedule

import java.time.OffsetDateTime
import java.util.UUID

interface ScheduleRepository {
    fun findAllByUserId(userId: UUID): List<ScheduleEntity>
    fun findAllByUserIdAndPetId(userId: UUID, petId: UUID): List<ScheduleEntity>
    fun findByIdAndUserId(id: UUID, userId: UUID): ScheduleEntity?
    fun findDueSchedules(beforeOrEqual: OffsetDateTime): List<ScheduleEntity>
    fun save(schedule: ScheduleEntity): ScheduleEntity
}

