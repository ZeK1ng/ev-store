package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.response.AuthRequest;
import ge.evstore.ev_store.response.AuthResponse;
import ge.evstore.ev_store.utils.JwtUtils;
import ge.evstore.ev_store.utils.TokenType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;

@Controller
@Slf4j
public class AuthenticationController {
    @Autowired
    private AuthenticationManager authManager;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails user = (UserDetails) auth.getPrincipal();

        String accessToken = JwtUtils.generateToken(user, TokenType.ACCESS_TOKEN);
        String refreshToken =  JwtUtils.generateToken(user, TokenType.REFRESH_TOKEN);

        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
    }

//    @PostMapping("/refresh")
//    public ResponseEntity<AuthResponse> refreshToken(@RequestBody Map<String, String> request) {
//        String refreshToken = request.get("refreshToken");
//        if (refreshToken == null) return ResponseEntity.badRequest().build();
//
//        String username = jwtUtil.extractUsername(refreshToken);
//        UserDetails user = userService.loadUserByUsername(username);
//
//        if (!jwtUtil.isTokenValid(refreshToken, user)) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//
//        String newAccessToken = jwtUtil.generateAccessToken(user);
//        return ResponseEntity.ok(new AuthResponse(newAccessToken, refreshToken));
//    }
}
