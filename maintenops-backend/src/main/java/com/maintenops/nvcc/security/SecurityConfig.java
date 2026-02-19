package com.maintenops.nvcc.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import tools.jackson.databind.ObjectMapper;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean // throws some error don't know what !!!
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration){
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(sm->sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize ->
                        authorize
                                .requestMatchers("/api/auth/**").permitAll()
                                .anyRequest().authenticated()
                )
                .httpBasic(AbstractHttpConfigurer::disable)
                .exceptionHandling(ex->ex.authenticationEntryPoint((request, response, authException) -> {

                                    response.setStatus(401);
                                    response.setContentType("application/json");
                                    String message = "Unauthorised Access: " + authException.getMessage();


                                    String error = (String) request.getAttribute("error");
                                    // This error I have set in filter for handling exceptions
                                    if(error != null) {
                                        message = error; // Modify the message
                                    }

                                    var apiError = ApiError.of(HttpStatus.UNAUTHORIZED.value(),
                                            "Unauthorized Access", message, request.getRequestURI());

                                    var objectMapper = new ObjectMapper();
                                    response.getWriter().write(objectMapper.writeValueAsString(apiError));
                                })
                                .accessDeniedHandler((request, response, e)-> {
                                    response.setStatus(403);
                                    response.setContentType("application/json");

                                    String message = e.getMessage();
                                    String error = (String) request.getAttribute("error");
                                    if(error!=null) {
                                        message = error;
                                    }

                                    var apiError = ApiError.of(HttpStatus.FORBIDDEN.value(),
                                            "Forbidden Access", message, request.getRequestURI());

                                    var objectMapper = new ObjectMapper();
                                    response.getWriter().write(objectMapper.writeValueAsString(apiError));

                                })
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


}
