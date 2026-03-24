package com.petory.record

import org.springframework.stereotype.Service
import java.util.UUID

@Service
class RecordService {
    fun getRecords(
        _petId: String?,
        _type: String?,
        _page: Int?,
    ): List<RecordResponse> = emptyList()

    fun createRecord(request: CreateRecordRequest): RecordResponse =
        RecordResponse(
            id = UUID.randomUUID().toString(),
            petId = request.petId,
            type = request.type,
            title = request.title,
            note = request.note,
            occurredAt = request.occurredAt,
            value = request.value,
            unit = request.unit,
            sourceScheduleId = request.sourceScheduleId,
        )
}
