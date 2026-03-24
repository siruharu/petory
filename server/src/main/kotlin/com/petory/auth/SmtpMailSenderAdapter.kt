package com.petory.auth

import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Component

@Component
class SmtpMailSenderAdapter(
    private val mailSender: JavaMailSender,
    private val verificationMailMessageTemplate: SimpleMailMessage,
) : MailSenderPort {
    override fun sendVerificationEmail(
        recipientEmail: String,
        verificationUrl: String,
    ) {
        val message = SimpleMailMessage(verificationMailMessageTemplate)
        message.setTo(recipientEmail)
        message.text = buildVerificationEmailBody(verificationUrl)

        mailSender.send(message)
    }

    private fun buildVerificationEmailBody(verificationUrl: String): String {
        return """
            Petory email verification

            Open the link below to verify your email address.
            $verificationUrl
        """.trimIndent()
    }
}
