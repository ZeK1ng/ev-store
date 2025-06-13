package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.Role;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    private UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userDetailsService = new UserDetailsServiceImpl(userRepository);
    }

    @Test
    void loadUserByUsername_ShouldReturnUserDetails_WhenUserExists() {
        // Arrange
        final String username = "test@example.com";
        final User mockUser = new User();
        mockUser.setEmail(username);
        mockUser.setPassword("encrypted-password");
        mockUser.setRole(Role.USER);
        when(userRepository.findByEmail(username.toLowerCase())).thenReturn(Optional.of(mockUser));

        // Act
        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // Assert
        assertNotNull(userDetails);
        assertEquals(username, userDetails.getUsername());
        assertEquals("encrypted-password", userDetails.getPassword());
        assertEquals(1, userDetails.getAuthorities().size());
        assertTrue(userDetails.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("USER")));
        verify(userRepository, times(1)).findByEmail(username.toLowerCase());
    }

    @Test
    void loadUserByUsername_ShouldThrowException_WhenUserDoesNotExist() {
        // Arrange
        final String username = "nonexistent@example.com";
        when(userRepository.findByEmail(username.toLowerCase())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> userDetailsService.loadUserByUsername(username));
        verify(userRepository, times(1)).findByEmail(username.toLowerCase());
    }

    @Test
    void getUserDetailsForUser_ShouldReturnUserDetails() {
        // Arrange
        final User mockUser = new User();
        mockUser.setEmail("test2@example.com");
        mockUser.setPassword("encrypted-password");
        mockUser.setRole(Role.ADMIN);

        // Act
        final UserDetails userDetails = userDetailsService.getUserDetailsForUser(mockUser);

        // Assert
        assertNotNull(userDetails);
        assertEquals("test2@example.com", userDetails.getUsername());
        assertEquals("encrypted-password", userDetails.getPassword());
        assertEquals(1, userDetails.getAuthorities().size());
        assertTrue(userDetails.getAuthorities().stream().anyMatch(auth -> auth.getAuthority().equals("ADMIN")));
    }
}