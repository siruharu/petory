package com.petory.notification

import com.petory.common.ApiResponse
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/notifications")
class NotificationController(
    private val notificationService: NotificationService,
) {
    @PostMapping("/tokens")
    fun registerToken(
        @RequestBody request: RegisterNotificationTokenRequest,
    ): ApiResponse<RegisterNotificationTokenResponse> =
        ApiResponse.of(notificationService.registerToken(request))

    @DeleteMapping("/tokens/{tokenId}")
    fun deleteToken(@PathVariable tokenId: String): ApiResponse<DeleteNotificationTokenResponse> =
        ApiResponse.of(notificationService.deleteToken(tokenId))
}
