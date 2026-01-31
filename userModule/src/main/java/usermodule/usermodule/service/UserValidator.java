package usermodule.usermodule.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import usermodule.usermodule.dto.SignupRequest;
import usermodule.usermodule.model.User;
import usermodule.usermodule.repository.UserRepository;

@Component
@RequiredArgsConstructor
public class UserValidator {

    private final UserRepository userRepository;

    public void validateSignup(SignupRequest request) {
        validateEmailFormat(request.getEmail());
        ensureEmailIsUnique(request.getEmail());
        validatePasswordStrength(request.getPassword());

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }
    }

    public void validateUserStatus(User user){
        if (user.getBlockedAcc()){
            throw new RuntimeException("Account is blocked.");
        }

        if(user.getDeletedAcc()){
            throw new RuntimeException("Account not found.");
        }

    }

    public void validateEmailFormat(String email) {
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }

    public void ensureEmailIsUnique(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already in use");
        }
    }

    public void ensureEmailExists(String email) {
        if (!userRepository.existsByEmail(email)) {
            throw new RuntimeException("User not found");
        }
    }

    public void validatePasswordStrength(String password) {
        if (password == null || password.length() < 2) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
    }
}