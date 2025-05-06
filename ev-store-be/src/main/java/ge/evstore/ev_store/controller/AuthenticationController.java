package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.request.AuthRequest;
import ge.evstore.ev_store.request.UserRegisterRequest;
import ge.evstore.ev_store.request.VerifyUserRequest;
import ge.evstore.ev_store.response.AuthResponse;
import ge.evstore.ev_store.service.AuthService;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/auth")
@RestController
@Slf4j
public class AuthenticationController {
    private final AuthService authService;

    public AuthenticationController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) throws AuthenticationException {
        log.info("Login request received for {}", request.getUsername());
        return ResponseEntity.ok(authService.handleLogin(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@RequestBody UserRegisterRequest userRegisterRequest) throws MessagingException {
        log.info("Register request for user {}", userRegisterRequest.toString());
        authService.handleRegister(userRegisterRequest);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestBody VerifyUserRequest verifyUserRequest) {
        log.info("Trying to verifyUserRequest:{}", verifyUserRequest);
        return ResponseEntity.ok(authService.verifyUser(verifyUserRequest));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> verifyUser(@RequestBody String userEmail) throws MessagingException {
        log.info("Trying to resend verification for:{}", userEmail);
        authService.resendVerificationCode(userEmail);
        return ResponseEntity.ok().build();
    }
}
