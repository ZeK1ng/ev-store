package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.AuthTokens;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthTokenRepository extends JpaRepository<AuthTokens, Integer> {
}
