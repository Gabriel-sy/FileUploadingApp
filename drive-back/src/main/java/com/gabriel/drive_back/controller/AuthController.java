package com.gabriel.drive_back.controller;

import com.fasterxml.jackson.core.JsonParser;
import com.gabriel.drive_back.domain.JwtDTO;
import com.gabriel.drive_back.domain.user.UserDTO;
import com.gabriel.drive_back.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(path = "/register")
    public ResponseEntity<Void> registerApi(@RequestBody UserDTO userDTO){
        userService.register(userDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping(path = "/login")
    public ResponseEntity<JwtDTO> loginApi(@RequestBody UserDTO userDTO, HttpServletResponse response){
        String loginCookie = userService.login(userDTO);
        JwtDTO jwt = new JwtDTO(loginCookie);
        return ResponseEntity.ok(jwt);
    }
}
