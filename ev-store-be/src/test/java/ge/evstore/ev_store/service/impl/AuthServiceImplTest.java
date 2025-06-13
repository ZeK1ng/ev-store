package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.AuthTokens;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.VerificationCodeExpiredException;
import ge.evstore.ev_store.exception.VerificationFailedException;
import ge.evstore.ev_store.repository.AuthTokenRepository;
import ge.evstore.ev_store.request.OtpVerificationRequest;
import ge.evstore.ev_store.request.VerifyUserRequest;
import ge.evstore.ev_store.response.AccessTokenResponse;
import ge.evstore.ev_store.service.interf.EmailService;
import ge.evstore.ev_store.service.interf.UserService;
import ge.evstore.ev_store.utils.JwtUtils;
import ge.evstore.ev_store.utils.TokenType;
import io.jsonwebtoken.MalformedJwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {

    @Mock
    private AuthenticationManager authManager;

    @Mock
    private AuthTokenRepository authTokenRepository;

    @Mock
    private UserService userService;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private EmailService emailService;

    @Mock
    private JwtUtils jwtUtils;

    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authService = new AuthServiceImpl(authManager, authTokenRepository, userService, userDetailsService, emailService, jwtUtils);
    }

    @Test
    void rotateAccessTokenForUser_ShouldReturnNewAccessToken_WhenValidRefreshToken() {
        // Arrange
        final String refreshToken = "valid-refresh-token";
        final String username = "testUser";
        final String newAccessToken = "new-access-token";

        final User mockUser = new User();
        mockUser.setEmail(username);

        final AuthTokens mockAuthTokens = new AuthTokens();
        mockAuthTokens.setUser(mockUser);
        mockAuthTokens.setRefreshToken(refreshToken);

        final UserDetails mockUserDetails = mock(UserDetails.class);
        when(jwtUtils.extractUsername(refreshToken)).thenReturn(username);
        when(jwtUtils.extractTokenTypeFromClaims(refreshToken)).thenReturn(TokenType.REFRESH_TOKEN.toString());
        when(jwtUtils.isTokenValid(eq(refreshToken), any())).thenReturn(true);
        when(userService.findUser(username)).thenReturn(Optional.of(mockUser));
        when(authTokenRepository.findByUser(mockUser)).thenReturn(mockAuthTokens);
        when(jwtUtils.generateToken(eq(mockUserDetails), eq(TokenType.ACCESS_TOKEN))).thenReturn(newAccessToken);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(mockUserDetails);

        // Act
        final AccessTokenResponse response = authService.rotateAccessTokenForUser(refreshToken);

        // Assert
        assertNotNull(response);
        assertEquals(newAccessToken, response.getAccessToken());
        verify(authTokenRepository, times(1)).save(mockAuthTokens);
    }

    @Test
    void rotateAccessTokenForUser_ShouldThrowException_WhenInvalidRefreshToken() {
        // Arrange
        final String invalidRefreshToken = "invalid-refresh-token";

        when(jwtUtils.extractTokenTypeFromClaims(invalidRefreshToken)).thenReturn(TokenType.REFRESH_TOKEN.toString());
        when(jwtUtils.isTokenValid(eq(invalidRefreshToken), any())).thenReturn(false);

        // Act & Assert
        assertThrows(MalformedJwtException.class, () -> authService.rotateAccessTokenForUser(invalidRefreshToken));
    }

    @Test
    void handleLogout_ShouldDeleteTokens_WhenValidToken() {
        // Arrange
        final String token = "valid-token";
        final String username = "testUser";

        final User mockUser = new User();
        when(jwtUtils.extractUsername(token)).thenReturn(username);
        when(userService.findUser(username)).thenReturn(Optional.of(mockUser));

        // Act
        authService.handleLogout(token);

        // Assert
        verify(authTokenRepository, times(1)).deleteByUser(mockUser);
    }

    @Test
    void verifyOtp_ShouldReturnTrue_WhenOtpIsValid() {
        // Arrange
        final OtpVerificationRequest otpRequest = new OtpVerificationRequest();
        otpRequest.setEmail("testUser@example.com");
        otpRequest.setOtp("123456");
        final User mockUser = new User();
        mockUser.setVerificationCode("123456");
        mockUser.setOtpVerificationExpiration(LocalDateTime.now().plusMinutes(5));

        when(userService.findUser("testUser@example.com")).thenReturn(Optional.of(mockUser));

        // Act
        final boolean result = authService.verifyOtp(otpRequest);

        // Assert
        assertTrue(result);
    }

    @Test
    void verifyOtp_ShouldThrowException_WhenOtpIsExpired() {
        // Arrange
        final OtpVerificationRequest otpRequest = new OtpVerificationRequest();
        otpRequest.setEmail("testUser@example.com");
        otpRequest.setOtp("123456");
        final User mockUser = new User();
        mockUser.setOtpVerificationExpiration(LocalDateTime.now().minusMinutes(1));
        when(userService.findUser("testUser@example.com")).thenReturn(Optional.of(mockUser));

        // Act & Assert
        assertThrows(VerificationCodeExpiredException.class, () -> authService.verifyOtp(otpRequest));
    }

    @Test
    void verifyUser_ShouldThrowException_WhenVerificationCodeMismatch() {
        // Arrange
        final VerifyUserRequest verifyRequest = new VerifyUserRequest();
        verifyRequest.setEmail("testUser@example.com");
        verifyRequest.setVerificationCode("incorrect-code");
        final User mockUser = new User();
        mockUser.setVerificationCode("correct-code");
        mockUser.setOtpVerificationExpiration(LocalDateTime.now().plusMinutes(5));

        when(userService.findUser("testUser@example.com")).thenReturn(Optional.of(mockUser));

        // Act & Assert
        assertThrows(VerificationFailedException.class, () -> authService.verifyUser(verifyRequest));
    }

    @Test
    void resendVerificationCode_ShouldSendEmail_WhenUserExists() throws Exception {
        // Arrange
        final String email = "testUser@example.com";
        final User mockUser = new User();
        when(userService.findUser(email)).thenReturn(Optional.of(mockUser));

        // Act
        authService.resendVerificationCode(email);

        // Assert
        verify(emailService, times(1)).sendVerificationCode(eq(email), anyString());
    }
}