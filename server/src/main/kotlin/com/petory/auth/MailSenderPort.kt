package com.petory.auth

interface MailSenderPort {
    fun sendVerificationEmail(
        recipientEmail: String,
        verificationUrl: String,
    )
}
