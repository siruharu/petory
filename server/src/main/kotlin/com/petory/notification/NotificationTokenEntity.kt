package com.petory.notification

import java.time.OffsetDateTime
import java.util.UUID

enum class DeviceType {
    IOS,
    ANDROID,
}

data class NotificationTokenEntity(
    val id: UUID = UUID.randomUUID(),
    val userId: UUID,
    val deviceType: DeviceType,
    val pushToken: String,
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
    val updatedAt: OffsetDateTime = OffsetDateTime.now(),
)

