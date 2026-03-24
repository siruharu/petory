package com.petory.common

import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    private val logger = LoggerFactory.getLogger(javaClass)

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgument(exception: IllegalArgumentException): ResponseEntity<ErrorResponse> {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(
                ErrorResponse(
                    error = ErrorBody(
                        code = ErrorCode.VALIDATION_ERROR,
                        message = exception.message ?: "Request body is invalid",
                    ),
                ),
            )
    }

    @ExceptionHandler(NoSuchElementException::class)
    fun handleNotFound(exception: NoSuchElementException): ResponseEntity<ErrorResponse> {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(
                ErrorResponse(
                    error = ErrorBody(
                        code = ErrorCode.NOT_FOUND,
                        message = exception.message ?: "Requested resource was not found",
                    ),
                ),
            )
    }

    @ExceptionHandler(EmailDeliveryException::class)
    fun handleEmailDelivery(exception: EmailDeliveryException): ResponseEntity<ErrorResponse> {
        logger.warn("Email delivery failed: {}", exception.message)

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(
                ErrorResponse(
                    error = ErrorBody(
                        code = ErrorCode.EMAIL_DELIVERY_FAILED,
                        message = "Unable to send verification email right now",
                    ),
                ),
            )
    }

    @ExceptionHandler(Exception::class)
    fun handleUnhandled(exception: Exception): ResponseEntity<ErrorResponse> {
        logger.error("Unhandled exception", exception)

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(
                ErrorResponse(
                    error = ErrorBody(
                        code = ErrorCode.INTERNAL_SERVER_ERROR,
                        message = exception.message ?: "Unexpected server error",
                    ),
                ),
            )
    }
}
