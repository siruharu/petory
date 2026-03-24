package com.petory.common

class EmailDeliveryException(
    override val message: String = "Verification email could not be sent",
    cause: Throwable? = null,
) : RuntimeException(message, cause)
