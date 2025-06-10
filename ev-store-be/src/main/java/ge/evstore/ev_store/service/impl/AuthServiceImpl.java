package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.annotation.UserTokenAspectMarker;
import ge.evstore.ev_store.entity.AuthTokens;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.exception.VerificationCodeExpiredException;
import ge.evstore.ev_store.exception.VerificationFailedException;
import ge.evstore.ev_store.repository.AuthTokenRepository;
import ge.evstore.ev_store.request.*;
import ge.evstore.ev_store.response.AccessTokenResponse;
import ge.evstore.ev_store.response.AuthResponse;
import ge.evstore.ev_store.service.interf.AuthService;
import ge.evstore.ev_store.service.interf.EmailService;
import ge.evstore.ev_store.service.interf.UserService;
import ge.evstore.ev_store.utils.JwtUtils;
import ge.evstore.ev_store.utils.TokenType;
import ge.evstore.ev_store.utils.VerificationUtils;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authManager;
    private final AuthTokenRepository authTokenRepository;
    private final UserService userService;
    private final UserDetailsServiceImpl userDetailsService;
    private final EmailService emailService;
    private final JwtUtils jwtUtils;

    public AuthServiceImpl(final AuthenticationManager authManager, final AuthTokenRepository authTokenRepository, final UserService userService, final UserDetailsServiceImpl userDetailsService, final EmailService emailService, final JwtUtils jwtUtils) {
        this.authManager = authManager;
        this.authTokenRepository = authTokenRepository;
        this.userService = userService;
        this.userDetailsService = userDetailsService;
        this.emailService = emailService;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public void registerTokensForUser(final User user, final String accessToken, final String refreshToken) {
        final AuthTokens authTokens = new AuthTokens();
        authTokens.setUser(user);
        authTokenRepository.deleteByUser(user);
        authTokenRepository.flush();
        authTokens.setAccessToken(accessToken);
        authTokens.setRefreshToken(refreshToken);
        authTokenRepository.save(authTokens);
    }

    @Transactional
    public AccessTokenResponse rotateAccessTokenForUser(final String refreshToken) {
        log.info("Attempting to rotate access token for refresh token");

        if (!validateToken(refreshToken, TokenType.REFRESH_TOKEN)) {
            log.warn("Invalid refresh token received");
            throw new MalformedJwtException("Invalid refresh token");
        }

        final String userName = jwtUtils.extractUsername(refreshToken);
        log.debug("Extracted username from refresh token: {}", userName);

        final Optional<User> user = userService.findUser(userName);
        if (user.isEmpty()) {
            log.error("User {} not found while rotating access token", userName);
            throw new UsernameNotFoundException("User " + userName + " not found");
        }
        final AuthTokens authTokens = authTokenRepository.findByUser(user.get());
        if (!authTokens.getRefreshToken().equals(refreshToken)) {
            log.warn("Mismatched refresh token for user {}", userName);
            throw new UnsupportedJwtException("Invalid refresh token for user " + userName);
        }
        final UserDetails userDetails = userDetailsService.loadUserByUsername(userName);

        final String accessToken = jwtUtils.generateToken(userDetails, TokenType.ACCESS_TOKEN);
        authTokens.setAccessToken(accessToken);
        authTokenRepository.save(authTokens);
        log.info("Successfully rotated access token for user {}", userName);
        return new AccessTokenResponse(accessToken);
    }

    @Override
    @Transactional
    @UserTokenAspectMarker
    public void handleLogout(final String token) {
        final String username = jwtUtils.extractUsername(token);
        log.info("Attempting logout for user: {}", username);

        final Optional<User> user = userService.findUser(username);
        if (user.isEmpty()) {
            log.warn("Logout failed: user '{}' not found", username);
            throw new UsernameNotFoundException("User " + username + " not found");
        }
        authTokenRepository.deleteByUser(user.get());
        log.info("Successfully logged out user: {}", username);
    }

    @Override
    public boolean validateToken(final String token, final TokenType tokenType) {
        try {
            final String s = jwtUtils.extractTokenTypeFromClaims(token);
            if (s == null || s.isBlank() || !s.equals(tokenType.toString())) {
                log.warn("Invalid token type. Expected: {}, Found: {}", tokenType, s);
                return false;
            }
            final String username = jwtUtils.extractUsername(token);
            final boolean isValid = jwtUtils.isTokenValid(token, userDetailsService.loadUserByUsername(username));
            log.debug("Token validation result for user '{}': {}", username, isValid);
            return isValid;
        } catch (final Exception e) {
            log.error("Token validation failed: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean verifyOtp(final OtpVerificationRequest otpVerificationRequest) {
        final String email = otpVerificationRequest.getEmail();
        log.info("Verifying OTP for email: {}", email);

        final Optional<User> user = userService.findUser(email);
        if (user.isEmpty()) {
            log.warn("OTP verification failed: user with email '{}' not found", email);
            return false;
        }

        final User user1 = user.get();
        if (user1.getOtpVerificationExpiration() == null || user1.getOtpVerificationExpiration().isBefore(LocalDateTime.now())) {
            log.warn("OTP expired for user '{}'", email);
            throw new VerificationCodeExpiredException("Verification code expired");
        }

        final boolean isMatch = user1.getVerificationCode().equals(otpVerificationRequest.getOtp());
        log.info("OTP verification {} for user '{}'", isMatch ? "succeeded" : "failed", email);
        return isMatch;
    }


    @Transactional
    public AuthResponse handleLogin(final AuthRequest request) {
        log.info("Attempting login for user: {}", request.getUsername());

        final Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        final UserDetails userDetails = (UserDetails) auth.getPrincipal();
        final Optional<User> userOptional = userService.findUser(userDetails.getUsername());

        if (userOptional.isEmpty()) {
            log.error("Login failed: user '{}' not found after authentication", request.getUsername());
            throw new UsernameNotFoundException("User not found for login: " + request.getUsername());
        }

        final User user = userOptional.get();
        log.info("Login successful for user: {}", user.getEmail());

        return generateAndRegisterTokens(userDetails, user);
    }

    @Transactional
    public void handleRegister(final UserRegisterRequest request) throws UserAlreadyRegisteredException, MessagingException {
        final String email = request.getEmail();
        log.info("Initiating registration for email: {}", email);

        final String verificationCode = VerificationUtils.generateVerificationCode();
        final User user = userService.registerUserWithoutVerification(request, verificationCode);

        log.info("User registered successfully without verification. Sending verification code to: {}", email);
        emailService.sendVerificationCode(user.getEmail(), verificationCode);

        log.info("Verification code sent successfully to: {}", email);
    }

    @Transactional
    public AuthResponse verifyUser(final VerifyUserRequest verifyUserRequest) {
        final String email = verifyUserRequest.getEmail();
        log.info("Initiating user verification for email: {}", email);

        final Optional<User> user = userService.findUser(email);
        if (user.isEmpty()) {
            logUserNotFound(email);
            throw new UsernameNotFoundException("User not found for email: " + email);
        }

        final User userFound = user.get();
        if (userFound.getOtpVerificationExpiration().isBefore(LocalDateTime.now())) {
            log.warn("Verification code expired for user: {}", email);
            throw new VerificationCodeExpiredException("Verification code expired for user: " + email);
        }

        if (!userFound.getVerificationCode().equals(verifyUserRequest.getVerificationCode())) {
            log.warn("Verification code mismatch for user: {}", email);
            throw new VerificationFailedException("Verification failed for user: " + email);
        }

        log.info("User '{}' successfully verified", email);
        final User verifiedUser = userService.verifyUser(userFound);
        log.info("Generating authentication tokens for user: {}", email);

        return generateAndRegisterTokens(userDetailsService.getUserDetailsForUser(verifiedUser), verifiedUser);
    }

    @Transactional
    public void resendVerificationCode(final String userEmail) throws MessagingException {
        log.info("Resend verification code requested for email: {}", userEmail);

        final Optional<User> user = userService.findUser(userEmail);
        if (user.isEmpty()) {
            logUserNotFound(userEmail);
            throw new UsernameNotFoundException("User not found for email: " + userEmail);
        }

        final User userFound = user.get();
        final String verificationCode = VerificationUtils.generateVerificationCode();
        userService.updateVerificationCodeFor(userFound, verificationCode);

        log.info("Updated verification code for user: {}", userEmail);
        emailService.sendVerificationCode(userEmail, verificationCode);
        log.info("Verification code resent successfully to: {}", userEmail);
    }

    @Transactional
    public AuthResponse generateAndRegisterTokens(final UserDetails userDetails, final User user) {
        log.info("Generating access and refresh tokens for user: {}", user.getEmail());

        final String accessToken = jwtUtils.generateToken(userDetails, TokenType.ACCESS_TOKEN);
        final String refreshToken = jwtUtils.generateToken(userDetails, TokenType.REFRESH_TOKEN);

        registerTokensForUser(user, accessToken, refreshToken);
        log.info("Tokens registered successfully for user: {}", user.getEmail());

        return new AuthResponse(accessToken, refreshToken);
    }

    @Transactional
    public void sendPasswordResetCode(final String email) throws MessagingException {
        log.info("Request received to send password reset code to email: {}", email);

        final Optional<User> user = userService.findUser(email);
        if (user.isEmpty()) {
            log.warn("Password reset failed - user not found for email: {}", email);
            throw new UsernameNotFoundException("User not found: " + email);
        }

        final String code = VerificationUtils.generateVerificationCode();
        userService.updateVerificationCodeFor(user.get(), code);

        emailService.sendPasswordResetCode(email, code);
        log.info("Password reset code sent successfully to email: {}", email);
    }

    @Transactional
    public void resetPassword(final ResetPasswordRequest request) {
        final String email = request.getEmail();
        log.info("Password reset requested for email: {}", email);

        final Optional<User> userOtp = userService.findUser(email);
        if (userOtp.isEmpty()) {
            log.warn("Password reset failed: user not found with email {}", email);
            throw new UsernameNotFoundException("User not found");
        }

        final User user = userOtp.get();

        userService.updatePassword(user, request.getNewPassword());
        log.info("Password updated successfully for user: {}", user.getEmail());
    }

    private static void logUserNotFound(final String userEmail) {
        log.info("User not found for email: {}", userEmail);
    }

}
