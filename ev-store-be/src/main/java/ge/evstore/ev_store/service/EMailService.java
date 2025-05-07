package ge.evstore.ev_store.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EMailService {

    private static final Logger logger = LoggerFactory.getLogger(EMailService.class);
    private final JavaMailSender mailSender;

    private static final String VERIFICATION_CODE_STR = "{{VERIFICATION_CODE}}";
    private static final String CODE_EXPIRATION_DURATION_STR = "{{CODE_EXPIRATION_DURATION}}";

    @Value("${verification.code.expiration.duration.minutes}")
    private String verifyCodeExpirationDuration;

    private static final String BASE_HTML_EMAIL_VERIFICATION_TEMPLATE = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Email Verification</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f7f9fb; padding: 20px; color: #333; }
                    .container { background-color: #ffffff; border-radius: 8px; max-width: 600px; margin: auto;
                                 padding: 30px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                    .code { font-size: 24px; font-weight: bold; background-color: #e7f3ff; padding: 12px 24px;
                            display: inline-block; border-radius: 6px; color: #0056b3; margin-top: 20px; }
                    .footer { margin-top: 30px; font-size: 12px; color: #777; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Email Verification</h2>
                    <p>Hello,</p>
                    <p>To verify your email address, please use the code below:</p>
                    <div class="code">{{VERIFICATION_CODE}}</div>
                    <p>This code will expire in {{CODE_EXPIRATION_DURATION}} minutes. If you did not request this, please ignore this message.</p>
                    <div class="footer">&copy; 2025 EV Store. All rights reserved.</div>
                </div>
            </body>
            </html>
            """;

    private static final String BASE_HTML_PWD_RESET_TEMPLATE = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Password Reset Code</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f7f9fb; padding: 20px; color: #333; }
                    .container { background-color: #ffffff; border-radius: 8px; max-width: 600px; margin: auto;
                                 padding: 30px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                    .code { font-size: 24px; font-weight: bold; background-color: #e7f3ff; padding: 12px 24px;
                            display: inline-block; border-radius: 6px; color: #0056b3; margin-top: 20px; }
                    .footer { margin-top: 30px; font-size: 12px; color: #777; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>Password Reset</h2>
                    <p>Hello,</p>
                    <p>To reset your password, please use the code below:</p>
                    <div class="code">{{VERIFICATION_CODE}}</div>
                    <p>This code will expire in {{CODE_EXPIRATION_DURATION}} minutes. If you did not request this, please ignore this message.</p>
                    <div class="footer">&copy; 2025 EV Store. All rights reserved.</div>
                </div>
            </body>
            </html>
            """;

    public EMailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationCode(String email, String verificationCode) throws MessagingException {
        sendHtmlEmail(email,getHtmlForVerificationCode(verificationCode));
    }

    public void sendPasswordResetCode(String email, String code) throws MessagingException {
        sendHtmlEmail(email,getHtmlForPasswordResetCode(code));
    }

    private void sendHtmlEmail(final String email, final String text) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
        helper.setSubject("EV Store Verification Code");
        helper.setTo(email);
        helper.setText(text, true);
        mailSender.send(mimeMessage);
        logger.info("Verification email sent to {}", email);
    }

    private String getHtmlForVerificationCode(String verificationCode) {
        return BASE_HTML_EMAIL_VERIFICATION_TEMPLATE
                .replace(VERIFICATION_CODE_STR, verificationCode)
                .replace(CODE_EXPIRATION_DURATION_STR, verifyCodeExpirationDuration);
    }

    private String getHtmlForPasswordResetCode(String verificationCode) {
        return BASE_HTML_PWD_RESET_TEMPLATE
                .replace(VERIFICATION_CODE_STR, verificationCode)
                .replace(CODE_EXPIRATION_DURATION_STR, verifyCodeExpirationDuration);
    }

}
