package ge.evstore.ev_store.scheduled;

import ge.evstore.ev_store.repository.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserCleanupService {
    private final UserRepository userRepository;

    public UserCleanupService(final UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Scheduled(cron = "0 0 0 * * *") // every day at midnight
    public void removeUnverifiedUsers() {
        final LocalDateTime cutoff = LocalDateTime.now().minusDays(1); // older than 24 hours
        final int deletedCount = userRepository.deleteUnverifiedUsersOlderThan(cutoff);
        System.out.println("Deleted " + deletedCount + " unverified users");
    }
}
