package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.request.*;
import ge.evstore.ev_store.response.AccessTokenResponse;
import ge.evstore.ev_store.response.AuthResponse;
import ge.evstore.ev_store.service.interf.AuthService;
import ge.evstore.ev_store.utils.HeaderUtils;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("api/v1/auth")
@RestController
@Slf4j
public class AuthenticationController {
    private final AuthService authService;

    public AuthenticationController(final AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(value = "/login")
    public ResponseEntity<AuthResponse> login(@RequestBody final AuthRequest request) throws AuthenticationException {
        log.info("Login request received for {}", request.getUsername());
        final AuthResponse authResponse = authService.handleLogin(request);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody final UserRegisterRequest userRegisterRequest) throws MessagingException {
        log.info("Register request for user {}", userRegisterRequest.toString());
        authService.handleRegister(userRegisterRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<AuthResponse> verifyUser(@Validated @RequestBody final VerifyUserRequest verifyUserRequest) {
        log.info("Trying to verifyUserRequest:{}", verifyUserRequest);
        return ResponseEntity.ok(authService.verifyUser(verifyUserRequest));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody final ResendVerificationRequest resendVerificationRequest) throws MessagingException {
        log.info("Trying to resend verification for:{}", resendVerificationRequest.getEmail());
        authService.resendVerificationCode(resendVerificationRequest.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody final ForgotPasswordRequest request) throws MessagingException {
        log.info("Sending password reset code to email:{}", request.getUsername());
        authService.sendPasswordResetCode(request.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody final ResetPasswordRequest request) {
        log.info("Setting new password for email:{}", request.getUsername());
        authService.resetPassword(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody final LogoutRequest request) {
        log.info("LogoutRequest for email:{}", request.getUsername());
        authService.handleLogout(request.getUsername());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/refresh")
    public ResponseEntity<AccessTokenResponse> refreshAccessToken(final HttpServletRequest request) {
        log.info("Refreshing access token");
        final String refreshToken = HeaderUtils.extractBearer(request);
        final AccessTokenResponse accessTokenResponse = authService.rotateAccessTokenForUser(refreshToken);
        return ResponseEntity.ok(accessTokenResponse);
    }
}
