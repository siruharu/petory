package com.petory.notification

import org.springframework.stereotype.Service
import java.util.UUID

@Service
class NotificationService {
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
}

