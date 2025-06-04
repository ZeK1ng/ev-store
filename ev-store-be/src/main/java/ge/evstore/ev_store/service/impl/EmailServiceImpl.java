package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.service.interf.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import static ge.evstore.ev_store.constants.EmailTemplates.BASE_HTML_EMAIL_VERIFICATION_TEMPLATE;
import static ge.evstore.ev_store.constants.EmailTemplates.BASE_HTML_PWD_RESET_TEMPLATE;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private static final String VERIFICATION_CODE_STR = "{{VERIFICATION_CODE}}";
    private static final String CODE_EXPIRATION_DURATION_STR = "{{CODE_EXPIRATION_DURATION}}";

    private final JavaMailSender mailSender;
    @Value("${verification.code.expiration.duration.minutes}")
    private String verifyCodeExpirationDuration;

    public EmailServiceImpl(final JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationCode(final String email, final String verificationCode) throws MessagingException {
        sendHtmlEmailForVerificationOrPassword(email, getHtmlForVerificationCode(verificationCode));
    }

    public void sendPasswordResetCode(final String email, final String code) throws MessagingException {
        sendHtmlEmailForVerificationOrPassword(email, getHtmlForPasswordResetCode(code));
    }


    private void sendHtmlEmailForVerificationOrPassword(final String email, final String text) throws MessagingException {
        final MimeMessage mimeMessage = mailSender.createMimeMessage();
        final MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
        helper.setSubject("EV Store Verification Code");
        helper.setTo(email);
        helper.setText(text, true);
        mailSender.send(mimeMessage);
        log.info("Verification email sent to {}", email);
    }

    private String getHtmlForVerificationCode(final String verificationCode) {
        return BASE_HTML_EMAIL_VERIFICATION_TEMPLATE
                .replace(VERIFICATION_CODE_STR, verificationCode)
                .replace(CODE_EXPIRATION_DURATION_STR, verifyCodeExpirationDuration);
    }

    private String getHtmlForPasswordResetCode(final String verificationCode) {
        return BASE_HTML_PWD_RESET_TEMPLATE
                .replace(VERIFICATION_CODE_STR, verificationCode)
                .replace(CODE_EXPIRATION_DURATION_STR, verifyCodeExpirationDuration);
    }

}
