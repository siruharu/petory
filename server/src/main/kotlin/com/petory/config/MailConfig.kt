package com.petory.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.mail.SimpleMailMessage

@Configuration
class MailConfig {
    @Bean
    fun verificationMailMessageTemplate(
        @Value("\${MAIL_FROM_ADDRESS:no-reply@petory.local}") fromAddress: String,
    ): SimpleMailMessage {
        val message = SimpleMailMessage()
        message.from = fromAddress
        message.subject = "Petory Email Verification"
        return message
    }
}
