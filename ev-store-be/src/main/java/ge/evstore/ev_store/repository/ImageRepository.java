package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<ImageEntity, Long> {
}
