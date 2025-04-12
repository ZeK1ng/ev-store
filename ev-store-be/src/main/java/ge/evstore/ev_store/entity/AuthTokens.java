package ge.evstore.ev_store.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class AuthTokens {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @OneToOne
    private User user;

    private String accessToken;
    private String refreshToken;
}
