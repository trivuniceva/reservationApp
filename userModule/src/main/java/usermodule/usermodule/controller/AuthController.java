package usermodule.usermodule.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import usermodule.usermodule.dto.ApiResponse;
import usermodule.usermodule.dto.SignupRequest;
import usermodule.usermodule.service.AuthService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest){
        System.out.println("<3");
        String message = authService.registerUser(signupRequest);
        return ResponseEntity.ok(new ApiResponse(message));

    }


}
