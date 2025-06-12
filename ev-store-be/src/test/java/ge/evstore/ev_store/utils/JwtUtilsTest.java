package ge.evstore.ev_store.utils;

import ge.evstore.ev_store.entity.ParameterConfigEntity;
import ge.evstore.ev_store.repository.ParametersConfigEntityRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class JwtUtilsTest {

    private static final String SECRET_KEY = "thisIsATestSecretKeyThatShouldBeAtLeast256BitsLongForHS256Algorithm";
    private static final String USERNAME = "testuser@example.com";
    private static final String ROLE = "ROLE_USER";
    private static final int ACCESS_TOKEN_LIFESPAN_MINUTES = 15;
    private static final int REFRESH_TOKEN_LIFESPAN_MINUTES = 1440; // 24 hours

    @Mock
    private ParametersConfigEntityRepository tokenConfigEntityRepository;

    @InjectMocks
    private JwtUtils jwtUtils;

    private UserDetails userDetails;
    private ParameterConfigEntity accessTokenConfig;
    private ParameterConfigEntity refreshTokenConfig;

    @BeforeEach
    void setUp() {
        // Set up the secret key using reflection
        ReflectionTestUtils.setField(jwtUtils, "jwtSecretStr", SECRET_KEY);

        // Create user details
        userDetails = new User(
                USERNAME,
                "password",
                Collections.singletonList(new SimpleGrantedAuthority(ROLE))
        );

        // Create configuration entities
        accessTokenConfig = new ParameterConfigEntity();
        accessTokenConfig.setId(1L);
        accessTokenConfig.setAccessTokenLifeSpanMinutes(ACCESS_TOKEN_LIFESPAN_MINUTES);

        refreshTokenConfig = new ParameterConfigEntity();
        refreshTokenConfig.setId(2L);
        refreshTokenConfig.setRefreshTokenLifeSpanMinutes(REFRESH_TOKEN_LIFESPAN_MINUTES);

        // Mock repository responses
        when(tokenConfigEntityRepository.findById(1L)).thenReturn(Optional.of(accessTokenConfig));
        when(tokenConfigEntityRepository.findById(2L)).thenReturn(Optional.of(refreshTokenConfig));
    }

    @Test
    void generateToken_withAccessTokenType_shouldCreateValidToken() {
        // Act
        final String token = jwtUtils.generateToken(userDetails, TokenType.ACCESS_TOKEN);

        // Assert
        assertNotNull(token);
        assertTrue(token.length() > 0);
        assertEquals(USERNAME, jwtUtils.extractUsername(token));
        assertEquals(TokenType.ACCESS_TOKEN.toString(), jwtUtils.extractTokenTypeFromClaims(token));
        assertFalse(jwtUtils.isTokenExpired(token));

        // Verify repository was called with correct ID
        verify(tokenConfigEntityRepository).findById(1L);
    }

    @Test
    void generateToken_withRefreshTokenType_shouldCreateValidToken() {
        // Act
        final String token = jwtUtils.generateToken(userDetails, TokenType.REFRESH_TOKEN);

        // Assert
        assertNotNull(token);
        assertTrue(token.length() > 0);
        assertEquals(USERNAME, jwtUtils.extractUsername(token));
        assertEquals(TokenType.REFRESH_TOKEN.toString(), jwtUtils.extractTokenTypeFromClaims(token));
        assertFalse(jwtUtils.isTokenExpired(token));

        // Verify repository was called with correct ID
        verify(tokenConfigEntityRepository).findById(2L);
    }

    @Test
    void extractUsername_withValidToken_shouldReturnUsername() {
        // Arrange
        final String token = jwtUtils.generateToken(userDetails, TokenType.ACCESS_TOKEN);

        // Act
        final String extractedUsername = jwtUtils.extractUsername(token);

        // Assert
        assertEquals(USERNAME, extractedUsername);
    }

    @Test
    void extractRoles_withValidToken_shouldReturnRoles() {
        // Arrange
        final String token = jwtUtils.generateToken(userDetails, TokenType.ACCESS_TOKEN);

        // Act
        final List<String> roles = jwtUtils.extractRoles(token);

        // Assert
        assertNotNull(roles);
        assertEquals(1, roles.size());
        assertEquals(ROLE, roles.get(0));
    }

    @Test
    void isTokenValid_withValidToken_shouldReturnTrue() {
        // Arrange
        final String token = jwtUtils.generateToken(userDetails, TokenType.ACCESS_TOKEN);

        // Act
        final boolean isValid = jwtUtils.isTokenValid(token, userDetails);

        // Assert
        assertTrue(isValid);
    }

    @Test
    void isTokenValid_withWrongUsername_shouldReturnFalse() {
        // Arrange
        final String token = jwtUtils.generateToken(userDetails, TokenType.ACCESS_TOKEN);
        final UserDetails differentUser = new User(
                "different@example.com",
                "password",
                Collections.singletonList(new SimpleGrantedAuthority(ROLE))
        );

        // Act
        final boolean isValid = jwtUtils.isTokenValid(token, differentUser);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void isTokenExpired_withValidToken_shouldReturnFalse() {
        // Arrange
        final String token = jwtUtils.generateToken(userDetails, TokenType.ACCESS_TOKEN);

        // Act
        final boolean isExpired = jwtUtils.isTokenExpired(token);

        // Assert
        assertFalse(isExpired);
    }

    @Test
    void extractAllClaims_withInvalidSignature_shouldThrowException() {
        // Arrange
        final String token = jwtUtils.generateToken(userDetails, TokenType.ACCESS_TOKEN);
        // Tamper with the token
        final String tamperedToken = token.substring(0, token.lastIndexOf('.') + 1) + "invalidSignature";

        // Act & Assert
        assertThrows(SignatureException.class, () -> jwtUtils.extractUsername(tamperedToken));
    }

    @Test
    void extractAllClaims_withMalformedToken_shouldThrowException() {
        // Arrange
        final String malformedToken = "not.a.valid.jwt.token";

        // Act & Assert
        assertThrows(MalformedJwtException.class, () -> jwtUtils.extractUsername(malformedToken));
    }

    @Test
    void extractTokenTypeFromClaims_withValidToken_shouldReturnCorrectType() {
        // Arrange
        final String accessToken = jwtUtils.generateToken(userDetails, TokenType.ACCESS_TOKEN);
        final String refreshToken = jwtUtils.generateToken(userDetails, TokenType.REFRESH_TOKEN);

        // Act
        final String accessTokenType = jwtUtils.extractTokenTypeFromClaims(accessToken);
        final String refreshTokenType = jwtUtils.extractTokenTypeFromClaims(refreshToken);

        // Assert
        assertEquals(TokenType.ACCESS_TOKEN.toString(), accessTokenType);
        assertEquals(TokenType.REFRESH_TOKEN.toString(), refreshTokenType);
    }

    // Helper method to extract expiration from token using reflection
    private Date extractExpirationFromToken(final String token) {
        try {
            return ReflectionTestUtils.invokeMethod(jwtUtils, "extractAllClaims", token, Claims.class);
        } catch (final Exception e) {
            fail("Failed to extract expiration: " + e.getMessage());
            return null;
        }
    }
}