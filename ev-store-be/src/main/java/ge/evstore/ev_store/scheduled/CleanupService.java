package ge.evstore.ev_store.scheduled;

import ge.evstore.ev_store.repository.UserRepository;
import ge.evstore.ev_store.service.interf.ImageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class CleanupService {
    private final UserRepository userRepository;
    private final ImageService imageService;

    @Scheduled(cron = "0 0 0 * * *") // every day at midnight
    public void removeUnverifiedUsers() {
        final LocalDateTime cutoff = LocalDateTime.now().minusDays(1); // older than 24 hours
        final int deletedCount = userRepository.deleteUnverifiedUsersOlderThan(cutoff);
        log.info("Deleted {} unverified users", deletedCount);
    }

    @Scheduled(cron = "0 0 0 * * *") // every day at midnight
    public void removeNotUsedImages() {
        final int deleted = imageService.deleteOrphanImages();
        log.info("Deleted {} orphan images", deleted);
    }
}
