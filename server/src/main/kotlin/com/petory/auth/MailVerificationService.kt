package com.petory.auth

import com.petory.user.EmailVerificationTokenEntity
import com.petory.user.EmailVerificationTokenRepository
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.UUID

@Service
class MailVerificationService(
    private val authProperties: AuthProperties,
    private val emailVerificationTokenRepository: EmailVerificationTokenRepository,
) {
    fun createVerificationToken(userId: String): EmailVerificationTokenEntity {
        val now = Instant.now()
        val expiresAt = now.plus(authProperties.verification.tokenExpiresMinutes, ChronoUnit.MINUTES)

        val tokenEntity = EmailVerificationTokenEntity(
            id = UUID.randomUUID().toString(),
            userId = userId,
            token = UUID.randomUUID().toString(),
            expiresAt = expiresAt,
            usedAt = null,
            createdAt = now,
        )

        return emailVerificationTokenRepository.save(tokenEntity)
    }

    fun isExpired(tokenEntity: EmailVerificationTokenEntity, now: Instant = Instant.now()): Boolean {
        return tokenEntity.expiresAt.isBefore(now)
    }

    fun isUsed(tokenEntity: EmailVerificationTokenEntity): Boolean {
        return tokenEntity.usedAt != null
    }

    fun deleteToken(tokenEntity: EmailVerificationTokenEntity) {
        emailVerificationTokenRepository.delete(tokenEntity)
    }
}
