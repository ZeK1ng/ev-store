package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
}
