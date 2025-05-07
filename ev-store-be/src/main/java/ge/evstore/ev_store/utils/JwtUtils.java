package ge.evstore.ev_store.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
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
public class JwtUtils {

    @Value("${security.jwt.secret}")
    private String jwtSecretStr;
    @Value("${access.token.life.span.hours}")
    private int accessTokenLifeSpanHours;
    @Value("${refresh.token.life.span.hours}")
    private int refreshTokenLifeSpanHours;

    public String generateToken(final UserDetails userDetails, final TokenType tokenType) {
        final Map<String, Object> claims = new HashMap<>();
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(Object::toString)
                .toList());
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

    private Instant getTokenExpiryInstant(final TokenType tokenType) {
        return switch (tokenType) {
            case REFRESH_TOKEN -> Instant.now().plus(Duration.ofHours(refreshTokenLifeSpanHours));
            case ACCESS_TOKEN -> Instant.now().plus(Duration.ofHours(accessTokenLifeSpanHours));
        };
    }
}
