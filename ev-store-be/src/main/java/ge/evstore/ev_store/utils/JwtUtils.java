package ge.evstore.ev_store.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

public class JwtUtils {
    private static final String SECRET = "very_secret_key"; //TODO replace

    @Value("${access.token.life.span.hours}")
    private static int accessTokenLifeSpanHours;
    @Value("${refresh.token.life.span.hours}")
    private static int refreshTokenLifeSpanHours;

    public static String generateToken(UserDetails userDetails, TokenType tokenType) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .claim("roles", userDetails.getAuthorities().toString())
                .claim("username", userDetails.getUsername())
                .claim("password", userDetails.getPassword())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(Date.from(getTokenExpiryInstant(tokenType)))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        Jws<Claims> claimsJws = Jwts.parserBuilder().setSigningKey(SECRET).build().parseClaimsJws(token);
        return claimsJws.getBody().getSubject();
    }

    public Date extractExpiration(String token) {
        Jws<Claims> claimsJws = Jwts.parserBuilder().setSigningKey(SECRET).build().parseClaimsJws(token);
        return claimsJws.getBody().getExpiration();
    }

    private static Instant getTokenExpiryInstant(TokenType tokenType) {
        return switch (tokenType) {
            case REFRESH_TOKEN -> Instant.now().plus(Duration.ofHours(refreshTokenLifeSpanHours));
            case ACCESS_TOKEN -> Instant.now().plus(Duration.ofHours(accessTokenLifeSpanHours));
        };
    }
}
