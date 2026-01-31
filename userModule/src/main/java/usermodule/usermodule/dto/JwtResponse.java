package usermodule.usermodule.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import usermodule.usermodule.model.UserRole;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String email;
    private String firstname;
    private String lastname;
    private UserRole role;
}
