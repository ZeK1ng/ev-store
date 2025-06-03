package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.MaxPriceEasySaver;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaxPriceSaverRepository extends JpaRepository<MaxPriceEasySaver, Long> {
}
