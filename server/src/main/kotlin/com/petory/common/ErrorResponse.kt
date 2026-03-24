package com.petory.common

data class ErrorResponse(
    val error: ErrorBody,
)

data class ErrorBody(
    val code: ErrorCode,
    val message: String,
    val fieldErrors: Map<String, String>? = null,
)

enum class ErrorCode {
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    VALIDATION_ERROR,
    CONFLICT,
    EMAIL_DELIVERY_FAILED,
    INTERNAL_SERVER_ERROR,
}
