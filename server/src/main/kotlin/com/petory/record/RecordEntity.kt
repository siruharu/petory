package com.petory.record

import java.math.BigDecimal
import java.time.OffsetDateTime
import java.util.UUID

enum class RecordType {
    VACCINATION,
    MEDICATION,
    WEIGHT,
    MEMO,
    VET_VISIT_MEMO,
}

data class RecordEntity(
    val id: UUID = UUID.randomUUID(),
    val userId: UUID,
    val petId: UUID,
    val type: RecordType,
    val title: String,
    val note: String? = null,
    val occurredAt: OffsetDateTime,
    val measurementValue: BigDecimal? = null,
    val unit: String? = null,
    val sourceScheduleId: UUID? = null,
)
