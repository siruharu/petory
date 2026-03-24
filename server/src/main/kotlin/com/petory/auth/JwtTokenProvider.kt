package com.petory.auth

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Component
import java.nio.charset.StandardCharsets
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.Date
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(
    private val authProperties: AuthProperties,
) {
    private fun signingKey(): SecretKey {
        val secret = authProperties.jwt.secret
        require(secret.isNotBlank()) { "JWT secret must not be blank" }
        require(secret.toByteArray(StandardCharsets.UTF_8).size >= 32) {
            "JWT secret must be at least 32 bytes"
        }

        return Keys.hmacShaKeyFor(secret.toByteArray(StandardCharsets.UTF_8))
    }

    fun generateAccessToken(userId: String): String {
        val now = Instant.now()
        val expiresAt = now.plus(authProperties.jwt.accessTokenExpiresMinutes, ChronoUnit.MINUTES)

        return Jwts.builder()
            .issuer(authProperties.jwt.issuer)
            .subject(userId)
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiresAt))
            .signWith(signingKey())
            .compact()
    }

    fun validateAccessToken(token: String): Boolean {
        return try {
            parseClaims(token)
            true
        } catch (_: Exception) {
            false
        }
    }

    fun extractUserId(token: String): String? {
        return try {
            parseClaims(token).subject?.takeIf { it.isNotBlank() }
        } catch (_: Exception) {
            null
        }
    }

    private fun parseClaims(token: String): Claims {
        require(token.isNotBlank()) { "JWT token must not be blank" }

        return Jwts.parser()
            .verifyWith(signingKey())
            .build()
            .parseSignedClaims(token)
            .payload
    }
}
