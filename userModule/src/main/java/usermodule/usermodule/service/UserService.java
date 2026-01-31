package usermodule.usermodule.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import usermodule.usermodule.dto.UserUpdateRequest;
import usermodule.usermodule.model.User;
import usermodule.usermodule.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;


    public User updateUser(String id, UserUpdateRequest request) {
        User user = userRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            // TODO: encode password
            user.setPassword(request.getPassword());
        }

        return userRepository.save(user);
    }
}
