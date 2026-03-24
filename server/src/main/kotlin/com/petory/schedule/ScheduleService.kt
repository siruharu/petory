package com.petory.schedule

import org.springframework.stereotype.Service
import java.time.OffsetDateTime
import java.util.UUID

@Service
class ScheduleService {
    fun getSchedules(_petId: String?): List<ScheduleResponse> = emptyList()

    fun createSchedule(request: CreateScheduleRequest): ScheduleResponse =
        ScheduleResponse(
            id = UUID.randomUUID().toString(),
            petId = request.petId,
            type = request.type,
            title = request.title,
            note = request.note,
            dueAt = request.dueAt,
            recurrenceType = request.recurrenceType,
            status = "scheduled",
            completedAt = null,
        )

    fun completeSchedule(scheduleId: String, request: CompleteScheduleRequest): CompleteScheduleResponse =
        CompleteScheduleResponse(
            schedule = buildCompletedSchedule(scheduleId, request),
            record = buildCompletedRecord(scheduleId, request),
            nextSchedule = buildNextSchedule(request),
        )

    private fun buildCompletedSchedule(
        scheduleId: String,
        request: CompleteScheduleRequest,
    ): ScheduleResponse =
        ScheduleResponse(
            id = scheduleId,
            petId = "TODO_PET_ID",
            type = "custom",
            title = "TODO_TITLE",
            note = null,
            dueAt = request.completedAt ?: OffsetDateTime.now().toString(),
            recurrenceType = "none",
            status = "completed",
            completedAt = request.completedAt,
        )

    private fun buildCompletedRecord(
        scheduleId: String,
        request: CompleteScheduleRequest,
    ): CompletedScheduleRecordResponse? {
        if (!request.createRecord) {
            return null
        }

        return CompletedScheduleRecordResponse(
            id = "TODO_RECORD_ID",
            petId = "TODO_PET_ID",
            type = "custom",
            title = "TODO_TITLE",
            note = null,
            occurredAt = request.completedAt ?: OffsetDateTime.now().toString(),
            value = null,
            unit = null,
            sourceScheduleId = scheduleId,
        )
    }

    private fun buildNextSchedule(request: CompleteScheduleRequest): ScheduleResponse? {
        val recurrenceType = "none"
        if (recurrenceType == "none") {
            return null
        }

        return ScheduleResponse(
            id = "TODO_NEXT_SCHEDULE_ID",
            petId = "TODO_PET_ID",
            type = "custom",
            title = "TODO_TITLE",
            note = null,
            dueAt = request.completedAt ?: OffsetDateTime.now().toString(),
            recurrenceType = recurrenceType,
            status = "scheduled",
            completedAt = null,
        )
    }
}
