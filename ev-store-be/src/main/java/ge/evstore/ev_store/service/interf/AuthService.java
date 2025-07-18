package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.request.*;
import ge.evstore.ev_store.response.AccessTokenResponse;
import ge.evstore.ev_store.response.AuthResponse;
import ge.evstore.ev_store.utils.TokenType;
import jakarta.mail.MessagingException;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthService {
    void registerTokensForUser(User user, String accessToken, String refreshToken);

    AuthResponse handleLogin(AuthRequest request);

    void handleRegister(UserRegisterRequest request) throws UserAlreadyRegisteredException, MessagingException;

    AuthResponse verifyUser(VerifyUserRequest verifyUserRequest);

    void resendVerificationCode(String userEmail) throws MessagingException;

    void sendPasswordResetCode(String email) throws MessagingException;

    void resetPassword(ResetPasswordRequest request);

    /**
     * This method could be made public and part of the interface if you intend to reuse token generation
     * from other classes. Otherwise, it can remain protected and internal to AuthServiceImpl.
     */
    AuthResponse generateAndRegisterTokens(UserDetails userDetails, User user);

    AccessTokenResponse rotateAccessTokenForUser(final String refreshToken);

    void handleLogout(String token);

    boolean validateToken(final String token , final TokenType tokenType);

    boolean verifyOtp(OtpVerificationRequest otpVerificationRequest);
}
