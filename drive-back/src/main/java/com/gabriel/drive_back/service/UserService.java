package com.gabriel.drive_back.service;

import com.gabriel.drive_back.domain.user.User;
import com.gabriel.drive_back.domain.user.UserDTO;
import com.gabriel.drive_back.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository, TokenService tokenService, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.authenticationManager = authenticationManager;
    }

    public void register(UserDTO userDTO){
        if (this.userRepository.findByLogin(userDTO.login()) == null){
            String encryptedPassword = new BCryptPasswordEncoder().encode(userDTO.password());
            User userToSave = new User(userDTO.login(), encryptedPassword);
            userRepository.save(userToSave);
        }
    }

    public String login(UserDTO userDTO) {
        var userNamePasswordWrapper = new UsernamePasswordAuthenticationToken(userDTO.login(), userDTO.password());

        var authenticate = authenticationManager.authenticate(userNamePasswordWrapper);

        String token = tokenService.generateToken((User) authenticate.getPrincipal());
//        Cookie cookie = new Cookie("jwt", token);
//        cookie.setPath("/");
//        cookie.setMaxAge(300);
//        cookie.setHttpOnly(true);
        return token;
    }
}
