package com.petory.schedule

import com.petory.auth.AuthenticatedUser
import com.petory.common.ApiResponse
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/schedules")
class ScheduleController(
    private val scheduleService: ScheduleService,
) {
    @GetMapping
    fun getSchedules(
        authentication: Authentication,
        @RequestParam(required = false) petId: String?,
        @RequestParam(required = false) status: String?,
        @RequestParam(required = false) from: String?,
        @RequestParam(required = false) to: String?,
    ): ApiResponse<List<ScheduleResponse>> =
        ApiResponse.of(
            scheduleService.getSchedules(
                userId = authentication.currentUserId(),
                petId = petId,
                filters = ScheduleFilters(status = status, from = from, to = to),
            ),
        )

    @PostMapping
    fun createSchedule(
        authentication: Authentication,
        @RequestBody request: CreateScheduleRequest,
    ): ApiResponse<ScheduleResponse> =
        ApiResponse.of(scheduleService.createSchedule(authentication.currentUserId(), request))

    @PostMapping("/{scheduleId}/complete")
    fun completeSchedule(
        authentication: Authentication,
        @PathVariable scheduleId: String,
        @RequestBody request: CompleteScheduleRequest,
    ): ApiResponse<CompleteScheduleResponse> =
        ApiResponse.of(scheduleService.completeSchedule(authentication.currentUserId(), scheduleId, request))

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
