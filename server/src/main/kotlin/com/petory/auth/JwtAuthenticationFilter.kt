package com.petory.auth

import com.petory.user.UserRepository
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtTokenProvider: JwtTokenProvider,
    private val userRepository: UserRepository,
) : OncePerRequestFilter() {
    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        val authorizationHeader = request.getHeader("Authorization")
        val bearerToken = authorizationHeader
            ?.takeIf { it.startsWith("Bearer ") }
            ?.removePrefix("Bearer ")
            ?.trim()

        if (!bearerToken.isNullOrBlank() && jwtTokenProvider.validateAccessToken(bearerToken)) {
            val userId = jwtTokenProvider.extractUserId(bearerToken)
            val user = userId?.let { userRepository.findById(it).orElse(null) }

            if (user != null) {
                val principal = AuthenticatedUser(
                    id = user.id,
                    email = user.email,
                )
                val authentication = UsernamePasswordAuthenticationToken(
                    principal,
                    null,
                    emptyList(),
                )
                authentication.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authentication
            }
        }

        filterChain.doFilter(request, response)
    }
}
