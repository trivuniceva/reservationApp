package usermodule.usermodule.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import usermodule.usermodule.dto.SignupRequest;
import usermodule.usermodule.model.User;
import usermodule.usermodule.model.UserRole;
import usermodule.usermodule.repository.UserRepository;

import java.util.Locale;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public String registerUser(SignupRequest signupRequest) {

        System.out.println("signup");
        System.out.println(signupRequest.toString());

        validateSignupRequest(signupRequest);

        User user = new User();
        user.setEmail(signupRequest.getEmail());

        // TODO: ENKRIPCIJA LOZINKE
        user.setPassword(signupRequest.getPassword());
        user.setFirstName(signupRequest.getFirstName());
        user.setLastName(signupRequest.getLastName());
        user.setAddress(signupRequest.getAddress());
        user.setPhone(signupRequest.getPhone());

        try {
            user.setUserRole(UserRole.valueOf(signupRequest.getUserRole().toUpperCase()));
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid user role. Must be GUEST or HOST");
        }

        user.setVerified(false);
        user.setDeletedAcc(false);
        user.setBlockedAcc(false);

        userRepository.save(user);

        return "User registered successfully";
    }

    private void validateSignupRequest(SignupRequest signupRequest) {

        if(signupRequest.getEmail() == null || signupRequest.getEmail().isBlank()){
            throw new IllegalArgumentException("Email is required");
        }

        if (emailExist(signupRequest.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        if(!signupRequest.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")){
            throw new IllegalArgumentException("Email format is invalid");
        }

        if(!signupRequest.getPassword().equals(signupRequest.getConfirmPassword())){
            throw new IllegalArgumentException("Passwords do not match");
        }

        // TODO: POVECAJ JACINU LOZINKE NA 8
        if(signupRequest.getPassword().length() < 2){
            throw new RuntimeException("Password must be at least 8 characters long");
        }
    }


    private boolean emailExist(String email) {
        return userRepository.findByEmail(email).isPresent();
    }


}
