package ge.evstore.ev_store.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One cart belongs to one user
    @OneToOne
    @Setter
    private User user;

    // A cart has many items
    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>();

    public void addItem(final CartItem item) {
        items.add(item);
        item.setCart(this);
    }

    // utility method
    public void removeItem(final CartItem item) {
        items.remove(item);
        item.setCart(null);
    }
}
