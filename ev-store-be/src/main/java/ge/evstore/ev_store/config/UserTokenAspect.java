package ge.evstore.ev_store.config;

import ge.evstore.ev_store.service.interf.AuthService;
import ge.evstore.ev_store.utils.JwtUtils;
import ge.evstore.ev_store.utils.TokenType;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class UserTokenAspect {
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;
    private final AuthService authService;

    public UserTokenAspect(final JwtUtils jwtUtils, final UserDetailsService userDetailsService, final AuthService authService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
        this.authService = authService;
    }

    @Around("execution(* ge.evstore.ev_store.service.impl.AdminServiceImpl(.., String, String))")
    public Object aroundMethodsForTokens(final ProceedingJoinPoint pjp) throws Throwable {
        final Object[] args = pjp.getArgs();
        final int n = args.length;
        String accessToken = (String) args[n - 2];
        final String refreshToken = (String) args[n - 1];
        final boolean refreshExpired = jwtUtils.isTokenExpired(refreshToken);
        if (refreshExpired) {
            throw new AccessDeniedException("Both access and refresh tokens are expired");
        }
        final boolean accessExpired = jwtUtils.isTokenExpired(accessToken);
        // Rotate both tokens if only the access token is expired
        if (accessExpired) {
            final String username = jwtUtils.extractUsername(refreshToken);
            final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            accessToken = jwtUtils.generateToken(userDetails, TokenType.ACCESS_TOKEN);
            authService.rotateAccessTokenForUser(username,accessToken);
            // replace the last two args
            args[n - 2] = accessToken;
            args[n - 1] = refreshToken;
        }

        // Proceed with (possibly) new tokens
        return pjp.proceed(args);
    }
}
