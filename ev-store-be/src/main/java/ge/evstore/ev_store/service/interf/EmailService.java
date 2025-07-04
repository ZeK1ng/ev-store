package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.request.AuthorizedReservationRequest;
import ge.evstore.ev_store.request.UnauthenticatedUserReservationRequest;
import ge.evstore.ev_store.response.CartResponse;
import jakarta.mail.MessagingException;

import java.time.LocalDateTime;

public interface EmailService {
    void sendVerificationCode(final String email, final String verificationCode) throws MessagingException;
    void sendPasswordResetCode(final String email, final String code) throws MessagingException;
    void sendReservationMailForUnauthorizedUser(UnauthenticatedUserReservationRequest request) throws MessagingException;

    void sendReservationMailForUser(User user, CartResponse cartForUser, String orderNumber, LocalDateTime orderDate, AuthorizedReservationRequest reservationRequest) throws MessagingException;
}
