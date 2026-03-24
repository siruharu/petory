package com.petory.pet

import com.petory.auth.AuthenticatedUser
import com.petory.common.ApiResponse
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/pets")
class PetController(
    private val petService: PetService,
) {
    @GetMapping
    fun getPets(authentication: Authentication): ApiResponse<List<PetResponse>> =
        ApiResponse.of(petService.getPets(authentication.currentUserId()))

    @PostMapping
    fun createPet(
        authentication: Authentication,
        @RequestBody request: CreatePetRequest,
    ): ApiResponse<PetResponse> = ApiResponse.of(petService.createPet(authentication.currentUserId(), request))

    @PatchMapping("/{petId}")
    fun updatePet(
        authentication: Authentication,
        @PathVariable petId: String,
        @RequestBody request: UpdatePetRequest,
    ): ApiResponse<PetResponse> = ApiResponse.of(
        petService.updatePet(authentication.currentUserId(), petId.toUuid("Pet id is invalid"), request),
    )

    private fun Authentication.currentUserId(): UUID {
        val principal = principal as? AuthenticatedUser
            ?: throw IllegalArgumentException("Authenticated user is required")
        return principal.id.toUuid("Authenticated user id is invalid")
    }

    private fun String.toUuid(message: String): UUID =
        try {
            UUID.fromString(this)
        } catch (_: IllegalArgumentException) {
            throw IllegalArgumentException(message)
        }
}
