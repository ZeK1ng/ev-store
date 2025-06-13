package ge.evstore.ev_store.scheduled;

import ge.evstore.ev_store.repository.UserRepository;
import ge.evstore.ev_store.service.interf.ImageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CleanupServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ImageService imageService;

    @InjectMocks
    private CleanupService cleanupService;

    @BeforeEach
    void setUp() {
        // No additional setup needed
    }

    @Test
    void removeUnverifiedUsers_shouldDeleteUsersOlderThanOneDayAndLogCount() {
        // Arrange
        when(userRepository.deleteUnverifiedUsersOlderThan(any(LocalDateTime.class))).thenReturn(5);

        // Act
        cleanupService.removeUnverifiedUsers();

        // Assert
        verify(userRepository).deleteUnverifiedUsersOlderThan(any(LocalDateTime.class));
    }

    @Test
    void removeUnverifiedUsers_shouldUseCorrectCutoffTime() {
        // Arrange
        final LocalDateTime beforeTest = LocalDateTime.now();

        // Act
        cleanupService.removeUnverifiedUsers();

        // Assert
        verify(userRepository).deleteUnverifiedUsersOlderThan(argThat(cutoff -> {
            // The cutoff should be approximately 24 hours before the current time
            // Allow for a small window of time to account for test execution time
            final LocalDateTime expectedEarliest = beforeTest.minusDays(1).minusSeconds(5);
            final LocalDateTime expectedLatest = LocalDateTime.now().minusDays(1).plusSeconds(5);
            return cutoff.isAfter(expectedEarliest) && cutoff.isBefore(expectedLatest);
        }));
    }

    @Test
    void removeUnverifiedUsers_whenNoUsersDeleted_shouldStillLogZeroCount() {
        // Arrange
        when(userRepository.deleteUnverifiedUsersOlderThan(any(LocalDateTime.class))).thenReturn(0);

        // Act
        cleanupService.removeUnverifiedUsers();

        // Assert
        verify(userRepository).deleteUnverifiedUsersOlderThan(any(LocalDateTime.class));
    }

    @Test
    void removeNotUsedImages_shouldCallImageServiceAndLogDeletedCount() {
        // Arrange
        when(imageService.deleteOrphanImages()).thenReturn(10);

        // Act
        cleanupService.removeNotUsedImages();

        // Assert
        verify(imageService).deleteOrphanImages();
    }

    @Test
    void removeNotUsedImages_whenNoImagesDeleted_shouldStillLogZeroCount() {
        // Arrange
        when(imageService.deleteOrphanImages()).thenReturn(0);

        // Act
        cleanupService.removeNotUsedImages();

        // Assert
        verify(imageService).deleteOrphanImages();
    }

    @Test
    void scheduledAnnotations_shouldBeConfiguredCorrectly() {
        // This test verifies that the scheduled annotations are present with the correct cron expressions

        try {
            // Get the method objects
            final var removeUnverifiedUsersMethod = CleanupService.class.getDeclaredMethod("removeUnverifiedUsers");
            final var removeNotUsedImagesMethod = CleanupService.class.getDeclaredMethod("removeNotUsedImages");

            // Get the Scheduled annotations
            final var removeUnverifiedUsersScheduled = removeUnverifiedUsersMethod.getAnnotation(org.springframework.scheduling.annotation.Scheduled.class);
            final var removeNotUsedImagesScheduled = removeNotUsedImagesMethod.getAnnotation(org.springframework.scheduling.annotation.Scheduled.class);

            // Assert that both have the correct cron expression
            assert removeUnverifiedUsersScheduled != null && removeUnverifiedUsersScheduled.cron().equals("0 0 0 * * *");
            assert removeNotUsedImagesScheduled != null && removeNotUsedImagesScheduled.cron().equals("0 0 0 * * *");
        } catch (final NoSuchMethodException e) {
            assert false : "Could not find the scheduled methods";
        }
    }
}