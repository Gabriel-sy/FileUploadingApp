package com.gabriel.drive_back.configuration;

import com.gabriel.drive_back.repository.UserRepository;
import com.gabriel.drive_back.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;

@Component
public class SecurityFilter extends OncePerRequestFilter {
    private final UserRepository userRepository;
    private final TokenService tokenService;

    public SecurityFilter(UserRepository userRepository, TokenService tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }



    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String jwtToken = getToken(request);
            if (jwtToken != null){
                String login = tokenService.validateToken(jwtToken);
                UserDetails user = userRepository.findByLogin(login);

                var authenticationWrapper = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authenticationWrapper);
            }
        filterChain.doFilter(request, response);
        }

    public String getToken(HttpServletRequest request){
        String token = request.getHeader("authorization");
        if (token != null && token.startsWith("Bearer")){
            return token.replace("Bearer ", "");
        } else {
            return null;
        }
    }

    }


