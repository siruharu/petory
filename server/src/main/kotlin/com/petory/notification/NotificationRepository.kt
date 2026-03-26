package com.petory.notification

import org.springframework.data.jpa.repository.JpaRepository
import java.time.OffsetDateTime
import java.util.UUID

interface NotificationTokenRepository : JpaRepository<NotificationTokenEntity, UUID> {
    fun findAllByUserId(userId: UUID): List<NotificationTokenEntity>
    fun findByIdAndUserId(id: UUID, userId: UUID): NotificationTokenEntity?
    fun deleteByIdAndUserId(id: UUID, userId: UUID)
}

interface NotificationJobRepository : JpaRepository<NotificationJobEntity, UUID> {
    fun findAllByStatusAndSendAtLessThanEqualOrderBySendAtAsc(
        status: NotificationJobStatus,
        sendAt: OffsetDateTime,
    ): List<NotificationJobEntity>
    fun findAllByScheduleId(scheduleId: UUID): List<NotificationJobEntity>
}
