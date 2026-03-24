package com.petory.record

import com.petory.common.ApiResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/records")
class RecordController(
    private val recordService: RecordService,
) {
    @GetMapping
    fun getRecords(
        @RequestParam(required = false) petId: String?,
        @RequestParam(required = false) type: String?,
        @RequestParam(required = false) page: Int?,
    ): ApiResponse<List<RecordResponse>> = ApiResponse.of(recordService.getRecords(petId, type, page))

    @PostMapping
    fun createRecord(@RequestBody request: CreateRecordRequest): ApiResponse<RecordResponse> =
        ApiResponse.of(recordService.createRecord(request))
}

