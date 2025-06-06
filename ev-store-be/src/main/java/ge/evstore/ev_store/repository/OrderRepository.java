package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.Order;
import ge.evstore.ev_store.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Order getOrderByUser(User user);
}
