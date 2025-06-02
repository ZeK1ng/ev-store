package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    @Transactional
    @Modifying
    @Query("DELETE FROM User u WHERE u.verified = false AND u.createdAt < :cutoff")
    int deleteUnverifiedUsersOlderThan(@Param("cutoff") LocalDateTime cutoff);

}
