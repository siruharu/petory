package com.petory.notification

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.OffsetDateTime
import java.util.UUID

@Service
class NotificationService(
    private val notificationJobRepository: NotificationJobRepository,
) {
    fun registerToken(request: RegisterNotificationTokenRequest): RegisterNotificationTokenResponse =
        RegisterNotificationTokenResponse(
            tokenId = UUID.randomUUID().toString(),
            deviceType = request.deviceType,
            pushToken = request.pushToken,
        )

    fun deleteToken(tokenId: String): DeleteNotificationTokenResponse =
        DeleteNotificationTokenResponse(
            deleted = true,
            tokenId = tokenId,
        )

    @Transactional
    fun scheduleJob(userId: UUID, scheduleId: UUID, sendAt: OffsetDateTime) {
        notificationJobRepository.save(
            NotificationJobEntity(
                userId = userId,
                scheduleId = scheduleId,
                sendAt = sendAt,
            ),
        )
    }

    @Transactional
    fun cancelPendingJobs(scheduleId: UUID) {
        val pendingJobs = notificationJobRepository.findAllByScheduleId(scheduleId)
            .filter { it.status == NotificationJobStatus.PENDING }

        pendingJobs.forEach { job ->
            notificationJobRepository.save(
                job.copy(status = NotificationJobStatus.CANCELED),
            )
        }
    }
}
