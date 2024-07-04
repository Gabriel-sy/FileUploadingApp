package com.gabriel.drive_back.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.gabriel.drive_back.domain.user.User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    static final String secret = "123";

    public String generateToken(User user){
        Algorithm algorithm = Algorithm.HMAC256(secret);

        try {
            return JWT.create()
                    .withIssuer("driveapp")
                    .withSubject(user.getLogin())
                    .withExpiresAt(getTokenExpiration())
                    .sign(algorithm);
        } catch (JWTCreationException e){
            throw new JWTCreationException("Erro ao criar token", e);
        }
    }

    public String validateToken(String token){
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("driveapp")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e){
            throw new JWTVerificationException("Erro ao verificar token");
        }
    }

    //Setando token para expirar em 2 horas.
    public Instant getTokenExpiration() {
        return LocalDateTime.now().plusHours(24).toInstant(ZoneOffset.of("-03:00"));
    }
}
