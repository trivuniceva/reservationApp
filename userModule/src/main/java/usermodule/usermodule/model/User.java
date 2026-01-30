package usermodule.usermodule.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email")
    private String  email;

    @Column(name = "password")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "userRole")
    private UserRole userRole;

    @Column(name = "firstName")
    private String firstName;

    @Column(name = "lastName")
    private String lastName;

    @Column(name = "address")
    private String address;

    @Column(name = "phone")
    private String phone;

    @Column(name = "profile_pic")
    private String profile_pic;

    @Column(name = "verified")
    private Boolean verified;

    @Column(name = "deletedAcc")
    private Boolean deletedAcc;

    @Column(name = "blockedAcc")
    private Boolean blockedAcc;


}
