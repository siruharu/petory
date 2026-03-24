package com.petory.schedule

import java.time.OffsetDateTime
import java.util.UUID

enum class ScheduleType {
    VACCINATION,
    PREVENTION,
    MEDICATION,
    VET_VISIT,
    CUSTOM,
}

enum class ScheduleStatus {
    SCHEDULED,
    COMPLETED,
    OVERDUE,
}

enum class RecurrenceType {
    NONE,
    DAILY,
    WEEKLY,
    MONTHLY,
}

data class ScheduleEntity(
    val id: UUID = UUID.randomUUID(),
    val userId: UUID,
    val petId: UUID,
    val type: ScheduleType,
    val title: String,
    val note: String? = null,
    val dueAt: OffsetDateTime,
    val recurrenceType: RecurrenceType,
    val status: ScheduleStatus,
    val completedAt: OffsetDateTime? = null,
)

