package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.ParameterConfigEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParametersConfigEntityRepository extends JpaRepository<ParameterConfigEntity, Long> {
}
