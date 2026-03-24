package com.petory.auth

import com.petory.common.EmailDeliveryException
import com.petory.user.EmailVerificationTokenRepository
import com.petory.user.UserEntity
import com.petory.user.UserRepository
import org.slf4j.LoggerFactory
import org.springframework.mail.MailException
import org.springframework.security.core.Authentication
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.UUID

@Service
class AuthService(
    private val jwtTokenProvider: JwtTokenProvider,
    private val userRepository: UserRepository,
    private val emailVerificationTokenRepository: EmailVerificationTokenRepository,
    private val passwordEncoder: PasswordEncoder,
    private val authProperties: AuthProperties,
    private val mailVerificationService: MailVerificationService,
    private val mailSenderPort: MailSenderPort,
) {
    private val logger = LoggerFactory.getLogger(javaClass)

    @Transactional
    fun signup(request: SignupRequest): SignupResponse {
        require(request.email.isNotBlank()) { "Email is required" }
        require(request.password.isNotBlank()) { "Password is required" }

        if (userRepository.findByEmail(request.email) != null) {
            throw IllegalArgumentException("Email already exists")
        }

        val userId = UUID.randomUUID().toString()
        val now = Instant.now()
        val user = UserEntity(
            id = userId,
            email = request.email,
            passwordHash = passwordEncoder.encode(request.password),
            emailVerified = false,
            createdAt = now,
            updatedAt = now,
        )
        val savedUser = userRepository.save(user)
        val verificationToken = mailVerificationService.createVerificationToken(savedUser.id)

        try {
            mailSenderPort.sendVerificationEmail(
                recipientEmail = savedUser.email,
                verificationUrl = buildVerificationUrl(verificationToken.token),
            )
        } catch (exception: MailException) {
            mailVerificationService.deleteToken(verificationToken)
            userRepository.delete(savedUser)
            logger.warn("Failed to send verification email during signup for {}", savedUser.email, exception)
            throw EmailDeliveryException(cause = exception)
        }

        return SignupResponse(
            userId = savedUser.id,
            email = savedUser.email,
            emailVerificationRequired = true,
        )
    }

    @Transactional
    fun verifyEmail(request: VerifyEmailRequest): VerifyEmailResponse {
        require(request.token.isNotBlank()) { "Verification token is required" }

        val tokenEntity = emailVerificationTokenRepository.findByToken(request.token)
            ?: throw NoSuchElementException("Verification token was not found")

        require(!mailVerificationService.isExpired(tokenEntity)) { "Verification token has expired" }
        require(!mailVerificationService.isUsed(tokenEntity)) { "Verification token has already been used" }

        val user = userRepository.findById(tokenEntity.userId)
            .orElseThrow { NoSuchElementException("User was not found") }

        user.emailVerified = true
        user.updatedAt = Instant.now()
        tokenEntity.usedAt = Instant.now()

        userRepository.save(user)
        emailVerificationTokenRepository.save(tokenEntity)

        return VerifyEmailResponse(
            verified = true,
            email = user.email,
        )
    }

    @Transactional
    fun resendVerification(request: ResendVerificationRequest): ResendVerificationResponse {
        require(request.email.isNotBlank()) { "Email is required" }

        val user = userRepository.findByEmail(request.email)
            ?: throw NoSuchElementException("User was not found")

        require(!user.emailVerified) { "Email is already verified" }

        val verificationToken = mailVerificationService.createVerificationToken(user.id)

        try {
            mailSenderPort.sendVerificationEmail(
                recipientEmail = user.email,
                verificationUrl = buildVerificationUrl(verificationToken.token),
            )
        } catch (exception: MailException) {
            mailVerificationService.deleteToken(verificationToken)
            logger.warn("Failed to resend verification email for {}", user.email, exception)
            throw EmailDeliveryException(cause = exception)
        }

        return ResendVerificationResponse(
            sent = true,
        )
    }

    fun login(request: LoginRequest): LoginResponse {
        require(request.email.isNotBlank()) { "Email is required" }
        require(request.password.isNotBlank()) { "Password is required" }

        val user = userRepository.findByEmail(request.email)
            ?: throw IllegalArgumentException("Invalid credentials")

        require(passwordEncoder.matches(request.password, user.passwordHash)) {
            "Invalid credentials"
        }
        require(user.emailVerified) { "Email verification is required" }

        val authUser = AuthUserDto(
            id = user.id,
            email = user.email,
            emailVerified = user.emailVerified,
        )

        return LoginResponse(
            user = authUser,
            accessToken = jwtTokenProvider.generateAccessToken(authUser.id),
        )
    }

    fun me(authentication: Authentication): MeResponse {
        val principal = authentication.principal as? AuthenticatedUser
            ?: throw IllegalArgumentException("Authenticated user is required")

        val userEntity = userRepository.findById(principal.id)
            .orElseThrow { NoSuchElementException("User was not found") }

        val user = AuthUserDto(
            id = userEntity.id,
            email = userEntity.email,
            emailVerified = userEntity.emailVerified,
        )

        return MeResponse(
            user = user,
        )
    }

    private fun buildVerificationUrl(token: String): String {
        val baseUrl = authProperties.verification.verifyBaseUrl.trimEnd('/')
        return "$baseUrl?token=$token"
    }
}
