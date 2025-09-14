package com.movieapp.movieapp;

import com.movieapp.movieapp.entity.Role;
import com.movieapp.movieapp.entity.User;
import com.movieapp.movieapp.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class ApplicationRunner {

    @Bean
    public CommandLineRunner initData(UserService userService, PasswordEncoder passwordEncoder) {
        System.out.println("Creating admin user");
        return args -> {
            if (userService.getUserByUsername("admin").isEmpty()) {
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .role(Role.ADMIN)
                        .build();
                userService.addUser(admin);
                User user = User.builder()
                        .username("user")
                        .password(passwordEncoder.encode("user"))
                        .role(Role.ADMIN)
                        .build();
                userService.addUser(user);
            }
        };
    }
}

// This is the token for the admin user ==>
// eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc1Nzg1NjAxOSwiZXhwIjoxNzU3ODkyMDE5fQ.ITmBFeFTGzN9_nJmabTouTCIzfD6LzXiPF2tbtIVSH4