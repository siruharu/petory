package com.petory.schedule

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
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

@Entity
@Table(name = "schedules")
data class ScheduleEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(name = "user_id", nullable = false)
    val userId: UUID,

    @Column(name = "pet_id", nullable = false)
    val petId: UUID,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val type: ScheduleType,

    @Column(nullable = false)
    val title: String,

    @Column
    val note: String? = null,

    @Column(name = "due_at", nullable = false)
    val dueAt: OffsetDateTime,

    @Enumerated(EnumType.STRING)
    @Column(name = "recurrence_type", nullable = false)
    val recurrenceType: RecurrenceType,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: ScheduleStatus,

    @Column(name = "completed_at")
    val completedAt: OffsetDateTime? = null,
)
