package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.request.AuthRequest;
import ge.evstore.ev_store.request.UserRegisterRequest;
import ge.evstore.ev_store.response.AuthResponse;
import ge.evstore.ev_store.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
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
    public ResponseEntity<AuthResponse> registerUser(@RequestBody UserRegisterRequest userRegisterRequest) {
        log.info("Register request for user {}", userRegisterRequest.toString());
        return ResponseEntity.ok(authService.handleRegister(userRegisterRequest));
    }
}
