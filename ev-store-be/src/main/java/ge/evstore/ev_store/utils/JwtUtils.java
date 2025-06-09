package ge.evstore.ev_store.utils;

import ge.evstore.ev_store.repository.ParametersConfigEntityRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtUtils {

    @Value("${security.jwt.secret}")
    private String jwtSecretStr;
    private final ParametersConfigEntityRepository tokenConfigEntityRepository;

    public String generateToken(final UserDetails userDetails, final TokenType tokenType) {
        final Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(Object::toString)
                .toList());
        claims.put("type", tokenType.toString());
        claims.put("username", userDetails.getUsername());
        final SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecretStr.getBytes());
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(Date.from(getTokenExpiryInstant(tokenType)))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(final String token) {
        return extractAllClaims(token).getSubject();
    }

    public List<String> extractRoles(final String token) {
        final Claims claims = extractAllClaims(token);
        return claims.get("roles", List.class);
    }

    public boolean isTokenValid(final String token, final UserDetails userDetails) {
        final String username = extractUsername(token);
        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(final String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

    private Claims extractAllClaims(final String token) {
        final SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecretStr.getBytes());
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractTokenTypeFromClaims(final String token) {
        final Claims claims = extractAllClaims(token);
        return claims.get("type", String.class);
    }

    private Instant getTokenExpiryInstant(final TokenType tokenType) {
        return switch (tokenType) {
            case ACCESS_TOKEN ->
                    Instant.now().plus(Duration.ofMinutes(tokenConfigEntityRepository.findById(1L).get().getAccessTokenLifeSpanMinutes()));
            case REFRESH_TOKEN ->
                    Instant.now().plus(Duration.ofMinutes(tokenConfigEntityRepository.findById(2L).get().getRefreshTokenLifeSpanMinutes()));
        };
    }
}
