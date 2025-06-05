package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.request.UnauthenticatedUserReservationRequest;
import jakarta.mail.MessagingException;

public interface EmailService {
    void sendVerificationCode(final String email, final String verificationCode) throws MessagingException;
    void sendPasswordResetCode(final String email, final String code) throws MessagingException;
    void sendReservationMailForUnauthorizedUser(UnauthenticatedUserReservationRequest request) throws MessagingException;
}
