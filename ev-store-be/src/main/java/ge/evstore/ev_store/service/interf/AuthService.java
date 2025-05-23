package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.request.AuthRequest;
import ge.evstore.ev_store.request.ResetPasswordRequest;
import ge.evstore.ev_store.request.UserRegisterRequest;
import ge.evstore.ev_store.request.VerifyUserRequest;
import ge.evstore.ev_store.response.AuthResponse;
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

    void rotateAccessTokenForUser(final String userName, final String accessToken);

    void handleLogout(String email);

    boolean validTokens(final String accessToken, final String refreshToken);
}
