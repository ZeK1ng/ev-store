package ge.evstore.ev_store.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String name;
    private String description;
    @ManyToOne
    private ImageEntity imageEntity;
    private double price;
    private int quantity;
    @ManyToOne
    private Category category;
}
