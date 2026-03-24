package com.petory.notification

import java.time.OffsetDateTime
import java.util.UUID

interface NotificationTokenRepository {
    fun findAllByUserId(userId: UUID): List<NotificationTokenEntity>
    fun findByIdAndUserId(id: UUID, userId: UUID): NotificationTokenEntity?
    fun save(token: NotificationTokenEntity): NotificationTokenEntity
    fun deleteByIdAndUserId(id: UUID, userId: UUID)
}

interface NotificationJobRepository {
    fun findPendingJobsBefore(sendAt: OffsetDateTime): List<NotificationJobEntity>
    fun findAllByScheduleId(scheduleId: UUID): List<NotificationJobEntity>
    fun save(job: NotificationJobEntity): NotificationJobEntity
}

