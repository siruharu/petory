package com.petory.dashboard

import com.petory.auth.AuthenticatedUser
import com.petory.common.ApiResponse
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/dashboard")
class DashboardController(
    private val dashboardService: DashboardService,
) {
    @GetMapping("/home")
    fun home(
        authentication: Authentication,
        @RequestParam(required = false) petId: String?,
    ): ApiResponse<HomeDashboardResponse> =
        ApiResponse.of(dashboardService.getHome(authentication.currentUserId(), petId))

    private fun Authentication.currentUserId(): UUID {
        val principal = principal as? AuthenticatedUser
            ?: throw IllegalArgumentException("Authenticated user is required")
        return try {
            UUID.fromString(principal.id)
        } catch (_: IllegalArgumentException) {
            throw IllegalArgumentException("Authenticated user id is invalid")
        }
    }
}
