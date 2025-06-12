package ge.evstore.ev_store.filter;

import ge.evstore.ev_store.utils.JwtUtils;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtAuthFilterTest {

    @Mock
    private UserDetailsService userDetailsService;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private JwtAuthFilter jwtAuthFilter;

    private UserDetails userDetails;
    private final String token = "valid.jwt.token";
    private final String username = "testuser@example.com";

    @BeforeEach
    void setUp() {
        userDetails = new User(username, "password", Collections.singleton(new SimpleGrantedAuthority("USER")));
        SecurityContextHolder.clearContext();
    }

    @Test
    void doFilterInternal_withNoAuthorizationHeader_shouldContinueFilterChain() throws ServletException, IOException {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn(null);

        // Act
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(filterChain).doFilter(request, response);
        verify(jwtUtils, never()).extractUsername(anyString());
    }

    @Test
    void doFilterInternal_withNonBearerToken_shouldContinueFilterChain() throws ServletException, IOException {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn("Basic dXNlcjpwYXNzd29yZA==");

        // Act
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(filterChain).doFilter(request, response);
        verify(jwtUtils, never()).extractUsername(anyString());
    }

    @Test
    void doFilterInternal_withInvalidJwtToken_shouldSendErrorResponse() throws ServletException, IOException {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtUtils.extractUsername(token)).thenThrow(new JwtException("Invalid token"));

        // Act
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(response).sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
        verify(filterChain, never()).doFilter(request, response);
    }

    @Test
    void doFilterInternal_withValidToken_shouldSetAuthentication() throws ServletException, IOException {
        // Arrange
        SecurityContextHolder.setContext(securityContext);

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtUtils.extractUsername(token)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        when(jwtUtils.isTokenValid(token, userDetails)).thenReturn(true);
        when(jwtUtils.extractRoles(token)).thenReturn(List.of("USER"));
        when(securityContext.getAuthentication()).thenReturn(null);
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");

        // Act
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(securityContext).setAuthentication(any(UsernamePasswordAuthenticationToken.class));
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_withValidTokenButAuthenticationExists_shouldNotSetAuthentication() throws ServletException, IOException {
        // Arrange
        SecurityContextHolder.setContext(securityContext);

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtUtils.extractUsername(token)).thenReturn(username);
        when(securityContext.getAuthentication()).thenReturn(mock(UsernamePasswordAuthenticationToken.class));

        // Act
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(userDetailsService, never()).loadUserByUsername(anyString());
        verify(securityContext, never()).setAuthentication(any());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_withValidTokenButInvalidUser_shouldNotSetAuthentication() throws ServletException, IOException {
        // Arrange
        SecurityContextHolder.setContext(securityContext);

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtUtils.extractUsername(token)).thenReturn(username);
        when(securityContext.getAuthentication()).thenReturn(null);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        when(jwtUtils.isTokenValid(token, userDetails)).thenReturn(false);

        // Act
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(securityContext, never()).setAuthentication(any());
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void doFilterInternal_correctlyExtractsAuthorities() throws ServletException, IOException {
        // Arrange
        SecurityContextHolder.setContext(securityContext);

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtUtils.extractUsername(token)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);
        when(jwtUtils.isTokenValid(token, userDetails)).thenReturn(true);
        when(jwtUtils.extractRoles(token)).thenReturn(List.of("USER", "ADMIN"));
        when(securityContext.getAuthentication()).thenReturn(null);
        when(request.getRemoteAddr()).thenReturn("127.0.0.1");

        // Act
        jwtAuthFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(securityContext).setAuthentication(argThat(auth -> {
            final var authorities = auth.getAuthorities();
            return authorities.size() == 2 &&
                    authorities.contains(new SimpleGrantedAuthority("USER")) &&
                    authorities.contains(new SimpleGrantedAuthority("ADMIN"));
        }));
        verify(filterChain).doFilter(request, response);
    }
}