package ge.evstore.ev_store.repository;

import ge.evstore.ev_store.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Integer> {
}
