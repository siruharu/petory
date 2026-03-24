package com.petory.auth

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "app.auth")
class AuthProperties {
    var jwt: JwtProperties = JwtProperties()
    var verification: VerificationProperties = VerificationProperties()

    class JwtProperties {
        var issuer: String = "petory"
        var secret: String = ""
        var accessTokenExpiresMinutes: Long = 60
    }

    class VerificationProperties {
        var tokenExpiresMinutes: Long = 30
        var verifyBaseUrl: String = "http://localhost:8081/verify-email"
    }
}
