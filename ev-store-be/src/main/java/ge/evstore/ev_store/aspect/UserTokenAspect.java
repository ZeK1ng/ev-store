package ge.evstore.ev_store.aspect;

import ge.evstore.ev_store.entity.Role;
import ge.evstore.ev_store.service.interf.AuthService;
import ge.evstore.ev_store.utils.JwtUtils;
import ge.evstore.ev_store.utils.TokenType;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Aspect
@Slf4j
public class UserTokenAspect {
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;
    private final AuthService authService;

    public UserTokenAspect(final JwtUtils jwtUtils, final UserDetailsService userDetailsService, final AuthService authService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
        this.authService = authService;
    }

    @Around("execution(* ge.evstore.ev_store.service.interf.AdminService.*(..))")
    public Object aroundMethodsForAccessTokenForAdmin(final ProceedingJoinPoint pjp) throws Throwable {
        final Object[] args = pjp.getArgs();
        final int n = args.length;
        final String accessToken = (String) args[n - 1];
        if (accessToken == null || accessToken.isEmpty()) {
            log.error("Access token or refresh token is empty");
            throw new AccessDeniedException("Access denied. Missing Token");
        }
        if (jwtUtils.isTokenExpired(accessToken)) {
            log.error("Access denied. Access token expired");
            throw new AccessDeniedException("Both access and refresh tokens are expired");
        }

        final List<String> roles = jwtUtils.extractRoles(accessToken);
        if (roles.isEmpty() || !roles.contains(Role.ADMIN.name())) {
            log.error("Access denied. User is not Admin");
            throw new AccessDeniedException("User is not Admin");
        }
        // Rotate both tokens if only the access token is expired
        if(!authService.validateToken(accessToken, TokenType.ACCESS_TOKEN)){
            log.error("Access denied. Tokens not valid");
            throw new AccessDeniedException("Tokens not valid");
        }
        return pjp.proceed(args);
    }



    //TODO
    @Around("@annotation(ge.evstore.ev_store.annotation.UserServiceAspectTarget)")
    public Object aroundMethodsForAccessTokenForUser(final ProceedingJoinPoint pjp) throws Throwable {
        final Object[] args = pjp.getArgs();
        final int n = args.length;
        final String accessToken = (String) args[n - 1];
        if (accessToken == null || accessToken.isEmpty()) {
            log.error("Access token or refresh token is empty");
            throw new AccessDeniedException("Access denied. Missing Token");
        }
        if (jwtUtils.isTokenExpired(accessToken)) {
            log.error("Access denied. Access token expired");
            throw new AccessDeniedException("Both access and refresh tokens are expired");
        }

        final List<String> roles = jwtUtils.extractRoles(accessToken);
        if (roles.isEmpty() || !roles.contains(Role.ADMIN.name())) {
            log.error("Access denied. User is not Admin");
            throw new AccessDeniedException("User is not Admin");
        }
        // Rotate both tokens if only the access token is expired
        if(!authService.validateToken(accessToken, TokenType.ACCESS_TOKEN)){
            log.error("Access denied. Tokens not valid");
            throw new AccessDeniedException("Tokens not valid");
        }
        return pjp.proceed(args);
    }
}
