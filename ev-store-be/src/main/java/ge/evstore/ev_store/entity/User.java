package ge.evstore.ev_store.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Table(name = "users")
public class User {
    @Schema(hidden = true)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String firstName;
    private String lastName;
    @Column(unique = true, nullable = false)
    private String email;
    private String mobile;
    private String address;
    private String city;
    private String personalIdCode;
    @Column(nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
    @OneToMany
    private List<Product> favourites;
    @Column(name = "otp_verification_code")
    private String verificationCode;
    @Column(name = "otp_verification_expiration")
    private LocalDateTime otpVerificationExpiration;
    private Boolean verified;
    @JsonIgnore
    private LocalDateTime createdAt;
    @OneToOne(cascade = CascadeType.ALL)
    private Cart cart;
}
