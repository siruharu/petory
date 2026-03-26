package com.petory.record

import com.petory.auth.AuthenticatedUser
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.OffsetDateTime
import java.util.UUID

@Service
class RecordService(
    private val recordRepository: RecordRepository,
) {
    @Transactional(readOnly = true)
    fun getRecords(
        userId: UUID,
        petId: String?,
        type: String?,
        _page: Int?,
    ): List<RecordResponse> {
        val resolvedPetId = petId?.takeIf { it.isNotBlank() }?.toUuid("Pet id is invalid")
        val resolvedType = type?.takeIf { it.isNotBlank() }?.toRecordType()

        val records = when {
            resolvedPetId != null && resolvedType != null ->
                recordRepository.findAllByUserIdAndPetIdAndTypeOrderByOccurredAtDesc(userId, resolvedPetId, resolvedType)
            resolvedPetId != null ->
                recordRepository.findAllByUserIdAndPetIdOrderByOccurredAtDesc(userId, resolvedPetId)
            else ->
                recordRepository.findAllByUserIdOrderByOccurredAtDesc(userId)
        }

        return records.map(::toResponse)
    }

    @Transactional
    fun createRecord(userId: UUID, request: CreateRecordRequest): RecordResponse {
        require(request.petId.isNotBlank()) { "Pet id is required" }
        require(request.type.isNotBlank()) { "Record type is required" }
        require(request.title.isNotBlank()) { "Record title is required" }

        val savedRecord = recordRepository.save(
            RecordEntity(
                userId = userId,
                petId = request.petId.toUuid("Pet id is invalid"),
                type = request.type.toRecordType(),
                title = request.title.trim(),
                note = request.note?.trim()?.ifBlank { null },
                occurredAt = parseOccurredAt(request.occurredAt),
                measurementValue = request.value?.toBigDecimal(),
                unit = request.unit?.trim()?.ifBlank { null },
                sourceScheduleId = request.sourceScheduleId?.takeIf { it.isNotBlank() }?.toUuid("Source schedule id is invalid"),
            ),
        )

        return toResponse(savedRecord)
    }

    @Transactional
    fun createRecord(request: CreateRecordRequest): RecordResponse =
        createRecord(UUID.randomUUID(), request)

    @Transactional
    fun createScheduledRecord(
        userId: UUID,
        petId: UUID,
        type: RecordType,
        title: String,
        note: String?,
        occurredAt: OffsetDateTime,
        sourceScheduleId: UUID,
    ): RecordResponse {
        val savedRecord = recordRepository.save(
            RecordEntity(
                userId = userId,
                petId = petId,
                type = type,
                title = title,
                note = note,
                occurredAt = occurredAt,
                measurementValue = null,
                unit = null,
                sourceScheduleId = sourceScheduleId,
            ),
        )

        return toResponse(savedRecord)
    }

    private fun parseOccurredAt(value: String): OffsetDateTime =
        try {
            OffsetDateTime.parse(value)
        } catch (_: Exception) {
            throw IllegalArgumentException("Occurred at must be in ISO-8601 format")
        }

    private fun String.toRecordType(): RecordType =
        try {
            RecordType.valueOf(trim().uppercase())
        } catch (_: IllegalArgumentException) {
            throw IllegalArgumentException("Record type is invalid")
        }

    private fun String.toUuid(message: String): UUID =
        try {
            UUID.fromString(this)
        } catch (_: IllegalArgumentException) {
            throw IllegalArgumentException(message)
        }

    private fun toResponse(entity: RecordEntity): RecordResponse =
        RecordResponse(
            id = entity.id.toString(),
            petId = entity.petId.toString(),
            type = entity.type.name.lowercase(),
            title = entity.title,
            note = entity.note,
            occurredAt = entity.occurredAt.toString(),
            value = entity.measurementValue?.toDouble(),
            unit = entity.unit,
            sourceScheduleId = entity.sourceScheduleId?.toString(),
        )
}
