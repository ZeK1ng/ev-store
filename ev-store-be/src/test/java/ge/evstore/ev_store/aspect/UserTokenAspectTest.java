package ge.evstore.ev_store.aspect;

import ge.evstore.ev_store.entity.Role;
import ge.evstore.ev_store.service.impl.AuthServiceImpl;
import ge.evstore.ev_store.utils.JwtUtils;
import ge.evstore.ev_store.utils.TokenType;
import org.aspectj.lang.ProceedingJoinPoint;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserTokenAspectTest {

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private AuthServiceImpl authService;

    @Mock
    private ProceedingJoinPoint joinPoint;

    @InjectMocks
    private UserTokenAspect securityAspect;

    private final String validAccessToken = "valid.access.token";
    private final String expiredAccessToken = "expired.access.token";
    private final String invalidAccessToken = "invalid.access.token";
    private final String nonAdminAccessToken = "non.admin.token";
    private final String emptyToken = "";

    @BeforeEach
    void setUp() {
        // Set up behavior for valid token

        // Set up behavior for expired token
//        when(jwtUtils.isTokenExpired(expiredAccessToken)).thenReturn(true);

        // Set up behavior for invalid token
//        when(jwtUtils.isTokenExpired(invalidAccessToken)).thenReturn(false);
//        when(jwtUtils.extractRoles(invalidAccessToken)).thenReturn(List.of(Role.ADMIN.name()));
//        when(authService.validateToken(invalidAccessToken, TokenType.ACCESS_TOKEN)).thenReturn(false);

        // Set up behavior for non-admin token
//        when(jwtUtils.isTokenExpired(nonAdminAccessToken)).thenReturn(false);
//        when(jwtUtils.extractRoles(nonAdminAccessToken)).thenReturn(List.of(Role.USER.name()));
    }
    

    @Test
    void whenValidAdminToken_thenProceed() throws Throwable {
        final Object[] args = new Object[]{"arg1", "arg2", validAccessToken};
        when(joinPoint.getArgs()).thenReturn(args);
        when(jwtUtils.isTokenExpired(validAccessToken)).thenReturn(false);
        when(authService.validateToken(validAccessToken, TokenType.ACCESS_TOKEN)).thenReturn(true);

        final Object expectedResult = new Object();
        when(joinPoint.proceed(args)).thenReturn(expectedResult);
        when(jwtUtils.extractRoles(validAccessToken)).thenReturn(List.of(Role.ADMIN.name()));

        // Act
        final Object result = securityAspect.aroundMethodsForAccessTokenForAdmin(joinPoint);

        // Assert
        assertEquals(expectedResult, result);
        verify(joinPoint).proceed(args);
        verify(jwtUtils).isTokenExpired(validAccessToken);
        verify(jwtUtils).extractRoles(validAccessToken);
        verify(authService).validateToken(validAccessToken, TokenType.ACCESS_TOKEN);

    }

    @Test
    void whenEmptyToken_thenThrowAccessDeniedException() throws Throwable {
        // Arrange
        final String emptyToken = "";
        final Object[] args = new Object[]{"arg1", "arg2", emptyToken};
        when(joinPoint.getArgs()).thenReturn(args);

        // Act & Assert
        final AccessDeniedException exception = assertThrows(
                AccessDeniedException.class,
                () -> securityAspect.aroundMethodsForAccessTokenForAdmin(joinPoint)
        );

        assertEquals("Access denied. Missing Token", exception.getMessage());
        verify(joinPoint, never()).proceed(any());
    }


    @Test
    void whenNullToken_thenThrowAccessDeniedException() throws Throwable {
        // Arrange
        final Object[] args = new Object[]{"arg1", "arg2", null};
        when(joinPoint.getArgs()).thenReturn(args);

        // Act & Assert
        final AccessDeniedException exception = assertThrows(
                AccessDeniedException.class,
                () -> securityAspect.aroundMethodsForAccessTokenForAdmin(joinPoint)
        );

        assertEquals("Access denied. Missing Token", exception.getMessage());
        verify(joinPoint, never()).proceed(any());
    }


    @Test
    void whenExpiredToken_thenThrowAccessDeniedException() throws Throwable {
        // Arrange
        final Object[] args = new Object[]{"arg1", "arg2", expiredAccessToken};
        when(joinPoint.getArgs()).thenReturn(args);
        when(jwtUtils.isTokenExpired(expiredAccessToken)).thenReturn(true);

        // Act & Assert
        final AccessDeniedException exception = assertThrows(
                AccessDeniedException.class,
                () -> securityAspect.aroundMethodsForAccessTokenForAdmin(joinPoint)
        );

        assertEquals("Both access and refresh tokens are expired", exception.getMessage());
        verify(jwtUtils).isTokenExpired(expiredAccessToken);
        verify(joinPoint, never()).proceed(any());
    }


    @Test
    void whenNonAdminToken_thenThrowAccessDeniedException() throws Throwable {
        // Arrange
        final Object[] args = new Object[]{"arg1", "arg2", nonAdminAccessToken};
        when(joinPoint.getArgs()).thenReturn(args);
        when(jwtUtils.isTokenExpired(nonAdminAccessToken)).thenReturn(false);
        when(jwtUtils.extractRoles(nonAdminAccessToken)).thenReturn(List.of("USER"));

        // Act & Assert
        final AccessDeniedException exception = assertThrows(
                AccessDeniedException.class,
                () -> securityAspect.aroundMethodsForAccessTokenForAdmin(joinPoint)
        );

        assertEquals("User is not Admin", exception.getMessage());
        verify(jwtUtils).isTokenExpired(nonAdminAccessToken);
        verify(jwtUtils).extractRoles(nonAdminAccessToken);
        verify(joinPoint, never()).proceed(any());
    }


    @Test
    void whenEmptyRoles_thenThrowAccessDeniedException() throws Throwable {
        // Arrange
        final Object[] args = new Object[]{"arg1", "arg2", "token.with.empty.roles"};
        when(joinPoint.getArgs()).thenReturn(args);
        when(jwtUtils.isTokenExpired("token.with.empty.roles")).thenReturn(false);
        when(jwtUtils.extractRoles("token.with.empty.roles")).thenReturn(Collections.emptyList());

        // Act & Assert
        final AccessDeniedException exception = assertThrows(
                AccessDeniedException.class,
                () -> securityAspect.aroundMethodsForAccessTokenForAdmin(joinPoint)
        );

        assertEquals("User is not Admin", exception.getMessage());
        verify(jwtUtils).isTokenExpired("token.with.empty.roles");
        verify(jwtUtils).extractRoles("token.with.empty.roles");
        verify(joinPoint, never()).proceed(any());
    }

    @Test
    void whenInvalidToken_thenThrowAccessDeniedException() throws Throwable {
        // Arrange
        final Object[] args = new Object[]{"arg1", "arg2", invalidAccessToken};
        when(joinPoint.getArgs()).thenReturn(args);
        when(jwtUtils.isTokenExpired(invalidAccessToken)).thenReturn(false);
        when(jwtUtils.extractRoles(invalidAccessToken)).thenReturn(List.of("ADMIN"));
        when(authService.validateToken(invalidAccessToken, TokenType.ACCESS_TOKEN)).thenReturn(false);

        // Act & Assert
        final AccessDeniedException exception = assertThrows(
                AccessDeniedException.class,
                () -> securityAspect.aroundMethodsForAccessTokenForAdmin(joinPoint)
        );

        assertEquals("Tokens not valid", exception.getMessage());
        verify(jwtUtils).isTokenExpired(invalidAccessToken);
        verify(jwtUtils).extractRoles(invalidAccessToken);
        verify(authService).validateToken(invalidAccessToken, TokenType.ACCESS_TOKEN);
        verify(joinPoint, never()).proceed(any());
    }
}