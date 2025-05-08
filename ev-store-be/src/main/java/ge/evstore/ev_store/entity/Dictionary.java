package ge.evstore.ev_store.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "dictionary")
@Data
public class Dictionary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String key;
    private String value;
}