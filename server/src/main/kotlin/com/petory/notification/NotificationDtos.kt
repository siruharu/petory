package com.petory.notification

data class RegisterNotificationTokenRequest(
    val deviceType: String,
    val pushToken: String,
)

data class RegisterNotificationTokenResponse(
    val tokenId: String,
    val deviceType: String,
    val pushToken: String,
)

data class DeleteNotificationTokenResponse(
    val deleted: Boolean,
    val tokenId: String,
)

