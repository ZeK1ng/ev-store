package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.AuthTokens;
import ge.evstore.ev_store.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface    AuthTokenRepository extends JpaRepository<AuthTokens, Integer> {
    @Transactional
    void deleteByUser(User user);

    AuthTokens findByUser(User user);
}
