package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository  extends JpaRepository<Category, Integer> {
}
