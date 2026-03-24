package com.petory.record

data class CreateRecordRequest(
    val petId: String,
    val type: String,
    val title: String,
    val note: String? = null,
    val occurredAt: String,
    val value: Double? = null,
    val unit: String? = null,
    val sourceScheduleId: String? = null,
)

data class RecordResponse(
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

