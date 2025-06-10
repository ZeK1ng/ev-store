package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @Query(value = "SELECT * FROM product p WHERE p.main_image_id = :id OR p.image_ids::jsonb @> to_jsonb(:id::bigint)::jsonb", nativeQuery = true)
    List<Product> findByImageId(long id);
}
