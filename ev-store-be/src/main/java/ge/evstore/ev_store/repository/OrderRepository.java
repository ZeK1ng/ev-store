package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.Order;
import ge.evstore.ev_store.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {
    List<Order> getOrderByUser(User user);
}
