package com.smartcampus.paf.service;

import com.smartcampus.paf.dto.request.UserRequestDTO;
import com.smartcampus.paf.dto.response.UserResponseDTO;
import com.smartcampus.paf.model.User;
import java.util.Optional;

public interface UserService {
    UserResponseDTO createOrUpdateUser(UserRequestDTO userRequest);
    Optional<User> findByEmail(String email);
    UserResponseDTO getUserById(String id);
    boolean existsByEmail(String email);
}