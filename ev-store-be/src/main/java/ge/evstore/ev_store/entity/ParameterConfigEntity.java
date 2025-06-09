package ge.evstore.ev_store.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class ParameterConfigEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer accessTokenLifeSpanMinutes;
    private Integer refreshTokenLifeSpanMinutes;
    private Integer verificationCodeLifeSpanMinutes;
}
