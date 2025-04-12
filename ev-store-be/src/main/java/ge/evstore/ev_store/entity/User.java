package ge.evstore.ev_store.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "users")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String address;
    private String city;
    private String personalIdCode;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
    @OneToMany
    private List<Product> favourites;
}
