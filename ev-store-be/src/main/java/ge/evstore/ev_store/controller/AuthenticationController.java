package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.request.*;
import ge.evstore.ev_store.response.AuthResponse;
import ge.evstore.ev_store.service.interf.AuthService;
import jakarta.mail.MessagingException;
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

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody final AuthRequest request) throws AuthenticationException {
        log.info("Login request received for {}", request.getUsername());
        return ResponseEntity.ok(authService.handleLogin(request));
    }
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody final UserRegisterRequest userRegisterRequest) throws MessagingException {
        log.info("Register request for user {}", userRegisterRequest.toString());
        authService.handleRegister(userRegisterRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@Validated @RequestBody final VerifyUserRequest verifyUserRequest) {
        log.info("Trying to verifyUserRequest:{}", verifyUserRequest);
        return ResponseEntity.ok(authService.verifyUser(verifyUserRequest));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody final String userEmail) throws MessagingException {
        log.info("Trying to resend verification for:{}", userEmail);
        authService.resendVerificationCode(userEmail);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody final ForgotPasswordRequest request) throws MessagingException {
        authService.sendPasswordResetCode(request.getEmail());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody final ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok().build();
    }
}
