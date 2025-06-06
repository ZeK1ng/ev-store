package ge.evstore.ev_store.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "order_items")
@Data
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which order this item belongs to
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // Which product (snapshot at time of order)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int quantity;

    // Price per unit at the time of ordering
    @Column(nullable = false)
    private Double unitPrice;

    // (Optional) total price for this line: quantity * unitPrice
    // You can either compute on the fly or store in DB
    @Column(name = "total_price", nullable = false)
    private Double totalPrice;
}