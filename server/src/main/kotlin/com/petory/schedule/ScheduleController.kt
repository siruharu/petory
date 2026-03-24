package com.petory.schedule

import com.petory.common.ApiResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/schedules")
class ScheduleController(
    private val scheduleService: ScheduleService,
) {
    @GetMapping
    fun getSchedules(@RequestParam(required = false) petId: String?): ApiResponse<List<ScheduleResponse>> =
        ApiResponse.of(scheduleService.getSchedules(petId))

    @PostMapping
    fun createSchedule(@RequestBody request: CreateScheduleRequest): ApiResponse<ScheduleResponse> =
        ApiResponse.of(scheduleService.createSchedule(request))

    @PostMapping("/{scheduleId}/complete")
    fun completeSchedule(
        @PathVariable scheduleId: String,
        @RequestBody request: CompleteScheduleRequest,
    ): ApiResponse<CompleteScheduleResponse> =
        ApiResponse.of(scheduleService.completeSchedule(scheduleId, request))
}
