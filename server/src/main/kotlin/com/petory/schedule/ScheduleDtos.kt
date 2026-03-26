package com.petory.schedule

import com.fasterxml.jackson.annotation.JsonIgnore

data class CreateScheduleRequest(
    val petId: String,
    val type: String,
    val title: String,
    val note: String? = null,
    val dueAt: String,
    val recurrenceType: String = "none",
)

data class CompleteScheduleRequest(
    val completedAt: String? = null,
    val createRecord: Boolean = true,
)

data class ScheduleFilters(
    val status: String? = null,
    val from: String? = null,
    val to: String? = null,
)

data class ScheduleResponse(
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

data class CompleteScheduleResponse(
    val schedule: ScheduleResponse,
    val record: CompletedScheduleRecordResponse?,
    val nextSchedule: ScheduleResponse?,
)

data class CompletedScheduleRecordResponse(
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
