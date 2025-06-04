package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category c WHERE c.parentCategory = :id")
    List<Category> findByParentCategory(Long id);

    /**
     * Fetch all categories where parentCategory is null (i.e. top‐level roots).
     */
    List<Category> findByParentCategoryIsNull();
}
