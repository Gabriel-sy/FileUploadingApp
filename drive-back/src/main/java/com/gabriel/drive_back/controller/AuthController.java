package com.gabriel.drive_back.controller;

import com.gabriel.drive_back.domain.JwtDTO;
import com.gabriel.drive_back.domain.user.User;
import com.gabriel.drive_back.domain.user.UserDTO;
import com.gabriel.drive_back.service.UserService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping(path = "/jwt")
    public ResponseEntity<User> findUserByToken(@RequestBody JwtDTO jwt){
            User userByToken = userService.findUserByToken(jwt.jwt());
            return ResponseEntity.ok(userByToken);
    }
}
