package com.petory.pet

import com.petory.common.ApiResponse
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/pets")
class PetController(
    private val petService: PetService,
) {
    @GetMapping
    fun getPets(): ApiResponse<List<PetResponse>> = ApiResponse.of(petService.getPets())

    @PostMapping
    fun createPet(@RequestBody request: CreatePetRequest): ApiResponse<PetResponse> =
        ApiResponse.of(petService.createPet(request))

    @PatchMapping("/{petId}")
    fun updatePet(
        @PathVariable petId: String,
        @RequestBody request: UpdatePetRequest,
    ): ApiResponse<PetResponse> = ApiResponse.of(petService.updatePet(petId, request))
}
