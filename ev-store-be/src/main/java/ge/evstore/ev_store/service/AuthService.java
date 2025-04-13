package ge.evstore.ev_store.service;

import ge.evstore.ev_store.entity.AuthTokens;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.repository.AuthTokenRepository;
import ge.evstore.ev_store.request.AuthRequest;
import ge.evstore.ev_store.request.UserRegisterRequest;
import ge.evstore.ev_store.response.AuthResponse;
import ge.evstore.ev_store.utils.JwtUtils;
import ge.evstore.ev_store.utils.TokenType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {
    private final AuthenticationManager authManager;
    private final AuthTokenRepository authTokenRepository;
    private final UserService userService;
    private final UserDetailsServiceImpl userDetailsService;

    public AuthService(AuthenticationManager authManager, AuthTokenRepository authTokenRepository, UserService userService, UserDetailsServiceImpl userDetailsService) {
        this.authManager = authManager;
        this.authTokenRepository = authTokenRepository;
        this.userService = userService;
        this.userDetailsService = userDetailsService;
    }

    @Transactional
    public void registerTokensForUser(User user, String accessToken, String refreshToken) {
        AuthTokens authTokens = new AuthTokens();
        authTokens.setUser(user);
        authTokens.setAccessToken(accessToken);
        authTokens.setRefreshToken(refreshToken);
        authTokenRepository.save(authTokens);
    }

    @Transactional
    public AuthResponse handleLogin(AuthRequest request) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        Optional<User> userOptional = userService.findUser(userDetails.getUsername());
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found for login: " + request.getUsername());
        }
        User user = userOptional.get();
        return generateAndRegisterTokens(userDetails, user);
    }

    @Transactional
    public AuthResponse handleRegister(UserRegisterRequest request) throws UserAlreadyRegisteredException {
        User user = userService.registerUser(request);
        UserDetails userDetailsForUser = userDetailsService.getUserDetailsForUser(user);
        return generateAndRegisterTokens(userDetailsForUser, user);
    }

    @Transactional
    protected AuthResponse generateAndRegisterTokens(UserDetails userDetails, User user) {
        String accessToken = JwtUtils.generateToken(userDetails, TokenType.ACCESS_TOKEN);
        String refreshToken = JwtUtils.generateToken(userDetails, TokenType.REFRESH_TOKEN);
        registerTokensForUser(user, accessToken, refreshToken);
        return new AuthResponse(accessToken, refreshToken);
    }
}
