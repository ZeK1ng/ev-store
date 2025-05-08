package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.AuthTokens;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.exception.VerificationCodeExpiredException;
import ge.evstore.ev_store.exception.VerificationFailedException;
import ge.evstore.ev_store.repository.AuthTokenRepository;
import ge.evstore.ev_store.repository.UserRepository;
import ge.evstore.ev_store.request.AuthRequest;
import ge.evstore.ev_store.request.ResetPasswordRequest;
import ge.evstore.ev_store.request.UserRegisterRequest;
import ge.evstore.ev_store.request.VerifyUserRequest;
import ge.evstore.ev_store.response.AuthResponse;
import ge.evstore.ev_store.service.interf.AuthService;
import ge.evstore.ev_store.service.interf.EmailService;
import ge.evstore.ev_store.service.interf.UserService;
import ge.evstore.ev_store.utils.JwtUtils;
import ge.evstore.ev_store.utils.TokenType;
import ge.evstore.ev_store.utils.VerificationUtils;
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
    private final UserRepository userRepository;

    public AuthServiceImpl(final AuthenticationManager authManager, final AuthTokenRepository authTokenRepository, final UserService userService, final UserDetailsServiceImpl userDetailsService, final EmailService emailService, final JwtUtils jwtUtils, final UserRepository userRepository) {
        this.authManager = authManager;
        this.authTokenRepository = authTokenRepository;
        this.userService = userService;
        this.userDetailsService = userDetailsService;
        this.emailService = emailService;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    @Transactional
    public void registerTokensForUser(final User user, final String accessToken, final String refreshToken) {
        final AuthTokens authTokens = new AuthTokens();
        authTokens.setUser(user);
        authTokens.setAccessToken(accessToken);
        authTokens.setRefreshToken(refreshToken);
        authTokenRepository.deleteByUser(user);
        authTokenRepository.save(authTokens);
    }

    @Transactional
    public void rotateAccessTokenForUser(final String userName, final String accessToken) {
        final Optional<User> user = userService.findUser(userName);
        if(user.isEmpty()) {
            throw new UsernameNotFoundException("User " + userName + " not found");
        }
        final AuthTokens authTokens = authTokenRepository.findByUser(user.get());
        authTokens.setAccessToken(accessToken);
        authTokenRepository.save(authTokens);
    }

    @Transactional
    public AuthResponse handleLogin(final AuthRequest request) {
        final Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        final UserDetails userDetails = (UserDetails) auth.getPrincipal();
        final Optional<User> userOptional = userService.findUser(userDetails.getUsername());
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found for login: " + request.getUsername());
        }
        final User user = userOptional.get();
        return generateAndRegisterTokens(userDetails, user);
    }

    @Transactional
    public void handleRegister(final UserRegisterRequest request) throws UserAlreadyRegisteredException, MessagingException {
        final String verificationCode = VerificationUtils.generateVerificationCode();
        final User user = userService.registerUserWithoutVerification(request, verificationCode);
        emailService.sendVerificationCode(user.getEmail(), verificationCode);
    }

    @Transactional
    public AuthResponse verifyUser(final VerifyUserRequest verifyUserRequest) {
        final Optional<User> user = userService.findUser(verifyUserRequest.getEmail());
        if (user.isEmpty()) {
            log.info("User not found for email: {}", verifyUserRequest.getEmail());
            throw new UsernameNotFoundException("User not found for email: " + verifyUserRequest.getEmail());
        }
        final User userFound = user.get();
        if (userFound.getOtpVerificationExpiration().isBefore(LocalDateTime.now())) {
            log.info("Verification code expired for user:{}", verifyUserRequest.getEmail());
            throw new VerificationCodeExpiredException("Verification code expired for user:" + userFound.getEmail());
        }
        if (!userFound.getVerificationCode().equals(verifyUserRequest.getVerificationCode())) {
            log.info("Verification code mismatch for user:{}", verifyUserRequest.getEmail());
            throw new VerificationFailedException("Verification failed for user:" + userFound.getEmail());
        }
        final User verifiedUser = userService.verifyUser(userFound);
        return generateAndRegisterTokens(userDetailsService.getUserDetailsForUser(verifiedUser), verifiedUser);
    }

    @Transactional
    public void resendVerificationCode(final String userEmail) throws MessagingException {
        final Optional<User> user = userService.findUser(userEmail);
        if (user.isEmpty()) {
            log.info("User not found for email: {}", userEmail);
            throw new UsernameNotFoundException("User not found for email: " + userEmail);
        }
        final User userFound = user.get();
        final String verificationCode = VerificationUtils.generateVerificationCode();
        userService.updateVerificationCodeFor(userFound, verificationCode);
        emailService.sendVerificationCode(userEmail, verificationCode);
    }

    @Transactional
    public AuthResponse generateAndRegisterTokens(final UserDetails userDetails, final User user) {
        final String accessToken = jwtUtils.generateToken(userDetails, TokenType.ACCESS_TOKEN);
        final String refreshToken = jwtUtils.generateToken(userDetails, TokenType.REFRESH_TOKEN);
        registerTokensForUser(user, accessToken, refreshToken);
        return new AuthResponse(accessToken, refreshToken);
    }

    @Transactional
    public void sendPasswordResetCode(final String email) throws MessagingException {
        final Optional<User> user = userService.findUser(email);
        if (user.isEmpty()) throw new UsernameNotFoundException("User not found: " + email);

        final String code = VerificationUtils.generateVerificationCode();
        userService.updateVerificationCodeFor(user.get(), code);
        emailService.sendPasswordResetCode(email, code);
    }

    @Transactional
    public void resetPassword(final ResetPasswordRequest request) {
        final Optional<User> userOpt = userService.findUser(request.getEmail());
        if (userOpt.isEmpty()) throw new UsernameNotFoundException("User not found");

        final User user = userOpt.get();

        if (user.getOtpVerificationExpiration() == null || user.getOtpVerificationExpiration().isBefore(LocalDateTime.now())) {
            throw new VerificationCodeExpiredException("Verification code expired");
        }

        if (!request.getVerificationCode().equals(user.getVerificationCode())) {
            throw new VerificationFailedException("Incorrect verification code");
        }

        userService.updatePassword(user, request.getNewPassword());
    }
}
