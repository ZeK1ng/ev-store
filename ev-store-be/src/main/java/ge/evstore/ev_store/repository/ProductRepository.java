package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Integer> {
}
