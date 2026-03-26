package com.petory.record

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table
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

@Entity
@Table(name = "records")
data class RecordEntity(
    @Id
    val id: UUID = UUID.randomUUID(),

    @Column(name = "user_id", nullable = false)
    val userId: UUID,

    @Column(name = "pet_id", nullable = false)
    val petId: UUID,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val type: RecordType,

    @Column(nullable = false)
    val title: String,

    @Column
    val note: String? = null,

    @Column(name = "occurred_at", nullable = false)
    val occurredAt: OffsetDateTime,

    @Column(name = "measurement_value")
    val measurementValue: BigDecimal? = null,

    @Column
    val unit: String? = null,

    @Column(name = "source_schedule_id")
    val sourceScheduleId: UUID? = null,
)
