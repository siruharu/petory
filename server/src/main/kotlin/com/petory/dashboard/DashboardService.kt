package com.petory.dashboard

import org.springframework.stereotype.Service

@Service
class DashboardService {
    fun getHome(_petId: String?): HomeDashboardResponse =
        HomeDashboardResponse(
            selectedPet = null,
            pets = emptyList(),
            todaySchedules = emptyList(),
            overdueSchedules = emptyList(),
            recentRecords = emptyList(),
        )
}

