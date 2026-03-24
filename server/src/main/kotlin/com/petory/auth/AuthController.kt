package com.petory.auth

import com.petory.common.ApiResponse
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
) {
    @PostMapping("/signup")
    fun signup(@RequestBody request: SignupRequest): ApiResponse<SignupResponse> {
        return ApiResponse.of(authService.signup(request))
    }

    @PostMapping("/verify-email")
    fun verifyEmail(@RequestBody request: VerifyEmailRequest): ApiResponse<VerifyEmailResponse> {
        return ApiResponse.of(authService.verifyEmail(request))
    }

    @PostMapping("/resend-verification")
    fun resendVerification(@RequestBody request: ResendVerificationRequest): ApiResponse<ResendVerificationResponse> {
        return ApiResponse.of(authService.resendVerification(request))
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ApiResponse<LoginResponse> {
        return ApiResponse.of(authService.login(request))
    }

    @GetMapping("/me")
    fun me(authentication: Authentication): ApiResponse<MeResponse> {
        return ApiResponse.of(authService.me(authentication))
    }
}
