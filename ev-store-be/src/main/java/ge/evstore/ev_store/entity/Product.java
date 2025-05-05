package ge.evstore.ev_store.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String nameGE;
    private String nameENG;
    private String nameRUS;

    private String descriptionGE;
    private String descriptionENG;
    private String descriptionRUS;

    private Double price;

    private Integer stockAmount;
    private int quantity;
    private Integer categoryId;

    @ManyToOne
    private ImageEntity imageEntity;
    @ManyToOne
    private Category category;
}
