package com.smartcampus.paf.service.impl;

import com.smartcampus.paf.dto.request.UserRequestDTO;
import com.smartcampus.paf.dto.response.UserResponseDTO;
import com.smartcampus.paf.model.User;
import com.smartcampus.paf.model.enums.Role;
import com.smartcampus.paf.repository.UserRepository;
import com.smartcampus.paf.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository userRepository;
    
    @Override
    public UserResponseDTO createOrUpdateUser(UserRequestDTO userRequest) {
        User user = userRepository.findByEmail(userRequest.getEmail())
                .orElse(new User());
        
        user.setEmail(userRequest.getEmail());
        user.setName(userRequest.getName());
        user.setPictureUrl(userRequest.getPictureUrl());
        user.setLastLogin(LocalDateTime.now());
        
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.getRoles().add(Role.ROLE_USER);
        }
        
        User savedUser = userRepository.save(user);
        
        return new UserResponseDTO(
            savedUser.getId(),
            savedUser.getEmail(),
            savedUser.getName(),
            savedUser.getPictureUrl(),
            savedUser.getRoles().stream().map(Enum::name).collect(Collectors.toSet())
        );
    }
    
    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Override
    public UserResponseDTO getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new UserResponseDTO(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getPictureUrl(),
            user.getRoles().stream().map(Enum::name).collect(Collectors.toSet())
        );
    }
    
    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}