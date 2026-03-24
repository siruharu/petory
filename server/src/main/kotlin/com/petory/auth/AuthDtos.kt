package com.petory.auth

data class SignupRequest(
    val email: String,
    val password: String,
)

data class LoginRequest(
    val email: String,
    val password: String,
)

data class VerifyEmailRequest(
    val token: String,
)

data class ResendVerificationRequest(
    val email: String,
)

data class AuthUserDto(
    val id: String,
    val email: String,
    val emailVerified: Boolean,
)

data class SignupResponse(
    val userId: String,
    val email: String,
    val emailVerificationRequired: Boolean,
)

data class LoginResponse(
    val user: AuthUserDto,
    val accessToken: String,
)

data class VerifyEmailResponse(
    val verified: Boolean,
    val email: String,
)

data class ResendVerificationResponse(
    val sent: Boolean,
)

data class MeResponse(
    val user: AuthUserDto,
)

@Deprecated("Use LoginRequest or SignupRequest explicitly")
typealias AuthRequest = LoginRequest

@Deprecated("Use LoginResponse explicitly")
typealias AuthResponse = LoginResponse
