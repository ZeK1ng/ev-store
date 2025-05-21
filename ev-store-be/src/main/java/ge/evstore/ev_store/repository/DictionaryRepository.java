package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.Dictionary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DictionaryRepository extends JpaRepository<Dictionary, Integer> {
}
