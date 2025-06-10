package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.repository.ParametersConfigEntityRepository;
import ge.evstore.ev_store.request.AuthorizedReservationRequest;
import ge.evstore.ev_store.request.CartItemReservationRequest;
import ge.evstore.ev_store.request.UnauthenticatedUserReservationRequest;
import ge.evstore.ev_store.response.CartResponse;
import ge.evstore.ev_store.service.interf.EmailService;
import ge.evstore.ev_store.utils.NumberFormatUtil;
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
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static ge.evstore.ev_store.constants.EmailTemplates.*;
import static ge.evstore.ev_store.utils.OrderUtils.generateOrderNumber;

@Service
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${email.sender.username}")
    private String storeMail;

    private final String verifyCodeExpirationDuration;

    public EmailServiceImpl(final JavaMailSender mailSender, final ParametersConfigEntityRepository parametersConfigEntityRepository) {
        this.mailSender = mailSender;
        this.verifyCodeExpirationDuration = parametersConfigEntityRepository.findById(3L).get().getVerificationCodeLifeSpanMinutes().toString();
    }


    public void sendVerificationCode(final String email, final String verificationCode) throws MessagingException {
        sendHtmlEmail(email, getHtmlForVerificationCode(verificationCode), VERIFICATION_EMAIL_SUBJECT);
    }

    public void sendPasswordResetCode(final String email, final String code) throws MessagingException {
        sendHtmlEmail(email, getHtmlForPasswordResetCode(code), PASSWORD_RESET_EMAIL_SUBJECT);
    }

    @Override
    public void sendReservationMailForUnauthorizedUser(final UnauthenticatedUserReservationRequest request) throws MessagingException {
        //TODO CHANGE DESTINATION TO BE STORE
        sendHtmlEmail(request.getEmail(), getHtmlForReservation(new ReservationRequestEntity(request)), RESERVATION_EMAIL_SUBJECT);
    }

    @Override
    public void sendReservationMailForUser(final User user, final CartResponse cartForUser, final String orderNumber, final LocalDateTime orderDate, final AuthorizedReservationRequest reservationRequest) throws MessagingException {
        //TODO CHANGE DESTINATION TO BE STORE
        final ReservationRequestEntity reservationRequestEntity = new ReservationRequestEntity(user, cartForUser, orderNumber, orderDate, reservationRequest);
        sendHtmlEmail(user.getEmail(), getHtmlForReservation(reservationRequestEntity), RESERVATION_EMAIL_SUBJECT);
    }

    private String getHtmlForReservation(final ReservationRequestEntity reservationRequestEntity) {
        final double totalPrice = reservationRequestEntity.getCartItems().stream()
                .mapToDouble(item -> item.getProductPrice() * item.getQuantity())
                .sum();
        final BigDecimal bd = new BigDecimal(totalPrice);
        final BigDecimal roundedBd = bd.setScale(2, RoundingMode.HALF_UP);
        return replaceClientInfo(reservationRequestEntity) + buildCartDetailsHtml(reservationRequestEntity.getCartItems()) + BASE_HTML_RESERVATION_TEMPLATE_END.replace(GRAND_TOTAL, roundedBd.toString()).replace(ORDER_DATE, reservationRequestEntity.getOrderDate().toString());
    }

    private String replaceClientInfo(final ReservationRequestEntity reservationRequestEntity) {
        String specialInstructions = reservationRequestEntity.getSpecialInstructions();
        if (specialInstructions == null || specialInstructions.isEmpty()) {
            specialInstructions = "No special instructions available";
        }
        return ge.evstore.ev_store.constants.EmailTemplates.BASE_HTML_RESERVATION_TEMPLATE_START.replace(MOBILE, reservationRequestEntity.mobile).replace(NAME, reservationRequestEntity.name)
                .replace(CITY, reservationRequestEntity.city).replace(ADDRESS, reservationRequestEntity.address).replace(NOTE, specialInstructions)
                .replace(EMAIL, reservationRequestEntity.getEmail()).replace(ORDER_ID, reservationRequestEntity.getOrderId());
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
            builder.append("<tr>")
                    .append("<td data-label=\"Product ID\" style=\"border:1px solid #E0E0E0;padding:12px;\">\n" +
                            "<span class=\"resp-title\">Product ID</span>\n" +
                            "<span\n" +
                            "style=\"display:inline-block;background-color:#F3F4F6;color:#555;padding:2px 8px;border-radius:4px;font-size:13px;font-weight:500;\">")
                    .append(item.getProductId())
                    .append("</span></td>")
                    .append("<td data-label=\"Product Name\" style=\"border:1px solid #E0E0E0;padding:12px;\">\n" +
                            "<span class=\"resp-title\">Product Name</span>")
                    .append(item.getProductName())
                    .append("</td>")
                    .append(" <td data-label=\"Quantity\" style=\"border:1px solid #E0E0E0;padding:12px;\">\n" +
                            "                      <span class=\"resp-title\">Quantity</span>\n" +
                            "                      <span\n" +
                            "                        style=\"display:inline-block;background-color:#F3F4F6;color:#555;padding:2px 8px;border-radius:4px;font-size:13px;font-weight:500;\">")
                    .append(item.getQuantity())
                    .append("</span></td>")
                    .append(" <td data-label=\"Unit Price\" style=\"border:1px solid #E0E0E0;padding:12px;\">\n" +
                            "                      <span class=\"resp-title\">Unit Price</span>")
                    .append(item.getProductPrice())
                    .append("</td>")
                    .append("   <td data-label=\"Total\" style=\"border:1px solid #E0E0E0;padding:12px;\">\n" +
                            "                      <span class=\"resp-title\">Total</span>")
                    .append(NumberFormatUtil.roundDouble(totalPrice))
                    .append("</td>")
                    .append("</tr>");
        }
        return builder.toString();
    }

    @Getter
    private static class ReservationRequestEntity {
        private final String name;
        private final String mobile;
        private final String city;
        private final String address;
        private final String email;
        private final List<CartItemReservationRequest> cartItems;
        private final String specialInstructions;
        private final String orderId;
        private final LocalDateTime orderDate;

        public ReservationRequestEntity(final UnauthenticatedUserReservationRequest request) {
            this.name = request.getName();
            this.mobile = request.getMobile();
            this.city = request.getCity();
            this.address = request.getAddress();
            this.cartItems = request.getCartItems();
            this.specialInstructions = request.getSpecialInstructions();
            this.email = request.getEmail();
            this.orderId = generateOrderNumber();
            this.orderDate = request.getOrderDate();
        }

        public ReservationRequestEntity(final User user, final CartResponse cartForUser, final String orderId, final LocalDateTime orderDate, final AuthorizedReservationRequest reservationRequest) {
            this.name = user.getFirstName() + " " + user.getLastName();
            this.address = (reservationRequest.getAddress() == null || reservationRequest.getAddress().isBlank()) ? user.getAddress() : reservationRequest.getAddress();
            this.city = (reservationRequest.getCity() == null || reservationRequest.getCity().isBlank()) ? user.getCity() : reservationRequest.getCity();
            this.mobile = (reservationRequest.getMobile() == null || reservationRequest.getMobile().isBlank()) ? user.getMobile() : reservationRequest.getMobile();
            this.orderId = orderId;
            this.specialInstructions = reservationRequest.getSpecialInstructions();
            this.cartItems = new ArrayList<>();
            this.email = user.getEmail();
            this.orderDate = orderDate;
            cartForUser.getItems().forEach(item -> {
                this.cartItems.add(new CartItemReservationRequest(item.getQuantity(), item.getProductId(), item.getNameENG(), item.getPrice()));
            });
        }
    }

}
