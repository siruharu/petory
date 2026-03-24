package com.petory.dashboard

import com.petory.common.ApiResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/dashboard")
class DashboardController(
    private val dashboardService: DashboardService,
) {
    @GetMapping("/home")
    fun home(@RequestParam(required = false) petId: String?): ApiResponse<HomeDashboardResponse> =
        ApiResponse.of(dashboardService.getHome(petId))
}
