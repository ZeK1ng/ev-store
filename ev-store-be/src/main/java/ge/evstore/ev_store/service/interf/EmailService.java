package ge.evstore.ev_store.service.interf;

import jakarta.mail.MessagingException;

public interface EmailService {
    void sendVerificationCode(final String email, final String verificationCode) throws MessagingException;
    void sendPasswordResetCode(final String email, final String code) throws MessagingException;
}
