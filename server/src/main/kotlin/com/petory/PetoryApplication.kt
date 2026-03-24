package com.petory

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration
import org.springframework.boot.runApplication


@SpringBootApplication(exclude = [UserDetailsServiceAutoConfiguration::class])
class PetoryApplication

fun main(args: Array<String>) {
    runApplication<PetoryApplication>(*args)
}
