package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.Order;
import ge.evstore.ev_store.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> getOrderByUser(User user);
}
