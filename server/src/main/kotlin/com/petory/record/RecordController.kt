package com.petory.record

import com.petory.auth.AuthenticatedUser
import com.petory.common.ApiResponse
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/records")
class RecordController(
    private val recordService: RecordService,
) {
    @GetMapping
    fun getRecords(
        authentication: Authentication,
        @RequestParam(required = false) petId: String?,
        @RequestParam(required = false) type: String?,
        @RequestParam(required = false) page: Int?,
    ): ApiResponse<List<RecordResponse>> =
        ApiResponse.of(recordService.getRecords(authentication.currentUserId(), petId, type, page))

    @PostMapping
    fun createRecord(
        authentication: Authentication,
        @RequestBody request: CreateRecordRequest,
    ): ApiResponse<RecordResponse> = ApiResponse.of(recordService.createRecord(authentication.currentUserId(), request))

    private fun Authentication.currentUserId(): UUID {
        val principal = principal as? AuthenticatedUser
            ?: throw IllegalArgumentException("Authenticated user is required")
        return try {
            UUID.fromString(principal.id)
        } catch (_: IllegalArgumentException) {
            throw IllegalArgumentException("Authenticated user id is invalid")
        }
    }
}
