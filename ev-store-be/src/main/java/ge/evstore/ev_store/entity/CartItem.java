package ge.evstore.ev_store.entity;

import jakarta.persistence.*;
import lombok.Setter;

@Entity
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    // Many items belong to one cart
    @Setter
    @ManyToOne
    private Cart cart;

    // Each item refers to a product
    @ManyToOne
    private Product product;

}