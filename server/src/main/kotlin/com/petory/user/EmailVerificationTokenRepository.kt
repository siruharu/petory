package com.petory.user

import org.springframework.data.jpa.repository.JpaRepository

interface EmailVerificationTokenRepository : JpaRepository<EmailVerificationTokenEntity, String> {
    fun findByToken(token: String): EmailVerificationTokenEntity?

    fun findAllByUserId(userId: String): List<EmailVerificationTokenEntity>
}
