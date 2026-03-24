package com.petory.notification

import java.time.OffsetDateTime
import java.util.UUID

enum class NotificationJobStatus {
    PENDING,
    SENT,
    FAILED,
    CANCELED,
}

data class NotificationJobEntity(
    val id: UUID = UUID.randomUUID(),
    val userId: UUID,
    val scheduleId: UUID,
    val sendAt: OffsetDateTime,
    val status: NotificationJobStatus = NotificationJobStatus.PENDING,
    val sentAt: OffsetDateTime? = null,
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
)

