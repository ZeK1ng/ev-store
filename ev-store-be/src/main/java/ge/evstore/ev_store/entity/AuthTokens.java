package ge.evstore.ev_store.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class AuthTokens {

    @Schema(hidden = true)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    private User user;
    @Column(length = 350)
    private String accessToken;
    @Column(length = 350)
    private String refreshToken;
}
