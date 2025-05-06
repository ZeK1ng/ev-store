package ge.evstore.ev_store.service;

import ge.evstore.ev_store.entity.AuthTokens;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.exception.VerificationCodeExpiredException;
import ge.evstore.ev_store.exception.VerificationFailedException;
import ge.evstore.ev_store.repository.AuthTokenRepository;
import ge.evstore.ev_store.request.AuthRequest;
import ge.evstore.ev_store.request.UserRegisterRequest;
import ge.evstore.ev_store.request.VerifyUserRequest;
import ge.evstore.ev_store.response.AuthResponse;
import ge.evstore.ev_store.utils.JwtUtils;
import ge.evstore.ev_store.utils.TokenType;
import ge.evstore.ev_store.utils.VerificationUtils;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
public class AuthService {
    private final AuthenticationManager authManager;
    private final AuthTokenRepository authTokenRepository;
    private final UserService userService;
    private final UserDetailsServiceImpl userDetailsService;
    private final EMailService emailService;

    public AuthService(AuthenticationManager authManager, AuthTokenRepository authTokenRepository, UserService userService, UserDetailsServiceImpl userDetailsService, EMailService emailService) {
        this.authManager = authManager;
        this.authTokenRepository = authTokenRepository;
        this.userService = userService;
        this.userDetailsService = userDetailsService;
        this.emailService = emailService;
    }

    @Transactional
    public void registerTokensForUser(User user, String accessToken, String refreshToken) {
        final AuthTokens authTokens = new AuthTokens();
        authTokens.setUser(user);
        authTokens.setAccessToken(accessToken);
        authTokens.setRefreshToken(refreshToken);
        authTokenRepository.save(authTokens);
    }

    @Transactional
    public AuthResponse handleLogin(AuthRequest request) {
        final Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        final UserDetails userDetails = (UserDetails) auth.getPrincipal();
        Optional<User> userOptional = userService.findUser(userDetails.getUsername());
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found for login: " + request.getUsername());
        }
        final User user = userOptional.get();
        return generateAndRegisterTokens(userDetails, user);
    }

    @Transactional
    public void handleRegister(UserRegisterRequest request) throws UserAlreadyRegisteredException, MessagingException {
        String verificationCode = VerificationUtils.generateVerificationCode();
        final User user = userService.registerUserWithoutVerification(request, verificationCode);
        emailService.sendVerificationCode(user.getEmail(), verificationCode);
    }

    @Transactional
    public AuthResponse verifyUser(VerifyUserRequest verifyUserRequest){
        Optional<User> user = userService.findUser(verifyUserRequest.getEmail());
        if(user.isEmpty()){
            log.info("User not found for email: {}", verifyUserRequest.getEmail());
            throw new UsernameNotFoundException("User not found for email: " + verifyUserRequest.getEmail());
        }
        User userFound = user.get();
        if(userFound.getOtpVerificationExpiration().isBefore(LocalDateTime.now())){
            log.info("Verification code expired for user:{}", verifyUserRequest.getEmail());
            throw new VerificationCodeExpiredException("Verification code expired for user:" + userFound.getEmail());
        }
        if(!userFound.getVerificationCode().equals(verifyUserRequest.getVerificationCode())){
            log.info("Verification code mismatch for user:{}. RequestCode:{}, UserCode:{}", verifyUserRequest.getEmail(), verifyUserRequest.getVerificationCode(), userFound.getVerificationCode());
            throw new VerificationFailedException("Verification failed for user:" + userFound.getEmail());
        }
        User verifiedUser = userService.verifyUser(userFound);
        return generateAndRegisterTokens(userDetailsService.getUserDetailsForUser(verifiedUser), verifiedUser);
    }

    @Transactional
    public void resendVerificationCode(String userEmail) throws MessagingException {
        Optional<User> user = userService.findUser(userEmail);
        if(user.isEmpty()){
            log.info("User not found for email: {}", userEmail);
            throw new UsernameNotFoundException("User not found for email: " + userEmail);
        }
        User userFound = user.get();
        String verificationCode = VerificationUtils.generateVerificationCode();
        userService.updateVerificationCodeFor(userFound, verificationCode);
        emailService.sendVerificationCode(userEmail, verificationCode);
    }

    @Transactional
    protected AuthResponse generateAndRegisterTokens(UserDetails userDetails, User user) {
        final String accessToken = JwtUtils.generateToken(userDetails, TokenType.ACCESS_TOKEN);
        final String refreshToken = JwtUtils.generateToken(userDetails, TokenType.REFRESH_TOKEN);
        registerTokensForUser(user, accessToken, refreshToken);
        return new AuthResponse(accessToken, refreshToken);
    }
}
