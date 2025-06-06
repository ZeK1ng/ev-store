package ge.evstore.ev_store.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "max_price")
@Getter
@Setter
public class MaxPriceEasySaver {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double maxPrice;
}
