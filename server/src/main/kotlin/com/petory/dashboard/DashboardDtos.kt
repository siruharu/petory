package com.petory.dashboard

data class DashboardPetResponse(
    val id: String,
    val name: String,
    val species: String,
    val breed: String? = null,
    val sex: String? = null,
    val neuteredStatus: String? = null,
    val birthDate: String? = null,
    val ageText: String? = null,
    val weight: Double? = null,
    val note: String? = null,
    val photoUrl: String? = null,
)

data class DashboardScheduleResponse(
    val id: String,
    val petId: String,
    val type: String,
    val title: String,
    val note: String? = null,
    val dueAt: String,
    val recurrenceType: String,
    val status: String,
    val completedAt: String? = null,
)

data class DashboardRecordResponse(
    val id: String,
    val petId: String,
    val type: String,
    val title: String,
    val note: String? = null,
    val occurredAt: String,
    val value: Double? = null,
    val unit: String? = null,
    val sourceScheduleId: String? = null,
)

data class HomeDashboardResponse(
    val selectedPet: DashboardPetResponse?,
    val pets: List<DashboardPetResponse>,
    val todaySchedules: List<DashboardScheduleResponse>,
    val overdueSchedules: List<DashboardScheduleResponse>,
    val recentRecords: List<DashboardRecordResponse>,
)
