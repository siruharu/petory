package com.petory.notification

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.OffsetDateTime
import java.util.UUID

enum class NotificationJobStatus {
    PENDING,
    SENT,
    FAILED,
    CANCELED,
}

@Entity
@Table(name = "notification_jobs")
data class NotificationJobEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(name = "user_id", nullable = false)
    val userId: UUID,

    @Column(name = "schedule_id", nullable = false)
    val scheduleId: UUID,

    @Column(name = "send_at", nullable = false)
    val sendAt: OffsetDateTime,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: NotificationJobStatus = NotificationJobStatus.PENDING,

    @Column(name = "sent_at")
    val sentAt: OffsetDateTime? = null,

    @Column(name = "created_at", nullable = false)
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
)
