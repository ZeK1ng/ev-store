package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.request.CartItemReservationRequest;
import ge.evstore.ev_store.request.UnauthenticatedUserReservationRequest;
import ge.evstore.ev_store.response.CartResponse;
import ge.evstore.ev_store.service.interf.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

import static ge.evstore.ev_store.constants.EmailTemplates.*;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    @Value("${verification.code.expiration.duration.minutes}")
    private String verifyCodeExpirationDuration;
    @Value("${store.email.address}")
    private String emailToStore;

    public EmailServiceImpl(final JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationCode(final String email, final String verificationCode) throws MessagingException {
        sendHtmlEmail(email, getHtmlForVerificationCode(verificationCode), VERIFICATION_EMAIL_SUBJECT);
    }

    public void sendPasswordResetCode(final String email, final String code) throws MessagingException {
        sendHtmlEmail(email, getHtmlForPasswordResetCode(code), PASSWORD_RESET_EMAIL_SUBJECT);
    }

    @Override
    public void sendReservationMailForUnauthorizedUser(final UnauthenticatedUserReservationRequest request) throws MessagingException {
        sendHtmlEmail(emailToStore, getHtmlForReservation(new ReservationRequestEntity(request)), RESERVATION_EMAIL_SUBJECT);
    }

    @Override
    public void sendReservationMailForUser(final User user, final CartResponse cartForUser) throws MessagingException {
        final ReservationRequestEntity reservationRequestEntity = new ReservationRequestEntity(user, cartForUser);
        sendHtmlEmail(emailToStore, getHtmlForReservation(reservationRequestEntity), RESERVATION_EMAIL_SUBJECT);
    }

    private String getHtmlForReservation(final ReservationRequestEntity reservationRequestEntity) {
        final double totalPrice = reservationRequestEntity.getCartItems().stream()
                .mapToDouble(item -> item.getProductPrice() * item.getQuantity())
                .sum();
        final BigDecimal bd = new BigDecimal(totalPrice);
        final BigDecimal roundedBd = bd.setScale(2, RoundingMode.HALF_UP);
        return replaceClientInfo(reservationRequestEntity) + buildCartDetailsHtml(reservationRequestEntity.getCartItems()) + BASE_HTML_RESERVATION_TEMPLATE_END.replace(GRAND_TOTAL, roundedBd.toString());
    }

    private String replaceClientInfo(final ReservationRequestEntity reservationRequestEntity) {
        return ge.evstore.ev_store.constants.EmailTemplates.BASE_HTML_RESERVATION_TEMPLATE_START.replace(PHONE, reservationRequestEntity.phone).replace(NAME, reservationRequestEntity.name)
                .replace(CITY, reservationRequestEntity.city).replace(ADDRESS, reservationRequestEntity.address).replace(NOTE, reservationRequestEntity.specialInstructions)
                .replace(EMAIL, reservationRequestEntity.getEmail());
    }


    private void sendHtmlEmail(final String email, final String text, final String subject) throws MessagingException {
        final MimeMessage mimeMessage = mailSender.createMimeMessage();
        final MimeMessageHelper helper = new MimeMessageHelper(mimeMessage);
        helper.setSubject(subject);
        helper.setTo(email);
        helper.setText(text, true);
        mailSender.send(mimeMessage);
        log.info("Email sent to {}", email);
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

    private String buildCartDetailsHtml(final List<CartItemReservationRequest> cartItems) {
        final StringBuilder builder = new StringBuilder();
        for (final CartItemReservationRequest item : cartItems) {
            final double totalPrice = item.getProductPrice() * item.getQuantity();
            final BigDecimal bd = new BigDecimal(totalPrice);
            final BigDecimal roundedBd = bd.setScale(2, RoundingMode.HALF_UP);
            builder.append("<tr>")
                    .append("<td><span class=\"badge\">")
                    .append(item.getProductId())
                    .append("</span></td>")
                    .append("<td>")
                    .append(item.getProductName())
                    .append("</td>")
                    .append("<td><span class=\"badge\">")
                    .append(item.getQuantity())
                    .append("</span></td>")
                    .append("<td>")
                    .append(item.getProductPrice())
                    .append("</td>")
                    .append("<td>")
                    .append(roundedBd)
                    .append("</td>")
                    .append("</tr>");
        }
        return builder.toString();
    }

    @Getter
    private static class ReservationRequestEntity {
        private final String name;
        private final String phone;
        private final String city;
        private final String address;
        private final String email;
        private final List<CartItemReservationRequest> cartItems;
        private final String specialInstructions;

        public ReservationRequestEntity(final UnauthenticatedUserReservationRequest request) {
            this.name = request.getName();
            this.phone = request.getPhone();
            this.city = request.getCity();
            this.address = request.getAddress();
            this.cartItems = request.getCartItems();
            this.specialInstructions = request.getSpecialInstructions();
            this.email = request.getEmail();
        }

        public ReservationRequestEntity(final User user, final CartResponse cartForUser) {
            this.name = user.getFirstName() + " " + user.getLastName();
            this.address = user.getAddress();
            this.city = user.getCity();
            this.phone = user.getMobile();
            this.specialInstructions = "";
            this.cartItems = new ArrayList<>();
            this.email = user.getEmail();
            cartForUser.getItems().forEach(item -> {
                this.cartItems.add(new CartItemReservationRequest(item.getQuantity(), item.getProductId(), item.getProductNameENG(), item.getPrice()));
            });
        }
    }

}
