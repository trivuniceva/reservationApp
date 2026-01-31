package usermodule.usermodule.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import usermodule.usermodule.dto.JwtResponse;
import usermodule.usermodule.dto.LoginRequest;
import usermodule.usermodule.dto.SignupRequest;
import usermodule.usermodule.model.User;
import usermodule.usermodule.model.UserRole;
import usermodule.usermodule.repository.UserRepository;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserValidator userValidator;

    public String registerUser(SignupRequest signupRequest) {
        System.out.println("signup");
        System.out.println(signupRequest.toString());

        userValidator.validateSignup(signupRequest);

        // TODO: odvojiti u mapToUser(signupReq)
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

    public JwtResponse login(LoginRequest loginRequest) {
        System.out.println(loginRequest.toString());

        userValidator.validateEmailFormat(loginRequest.getEmail());

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        userValidator.validateUserStatus(user);

        // TODO: dekriptovati password
        if(!user.getPassword().equals(loginRequest.getPassword())){
            throw new RuntimeException("Invalid email or password");
        }

        return new JwtResponse(
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getUserRole()
        );
    }


}
