package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.annotation.UserTokenAspectMarker;
import ge.evstore.ev_store.entity.Order;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.CartNotFoundException;
import ge.evstore.ev_store.request.AuthorizedReservationRequest;
import ge.evstore.ev_store.request.UnauthenticatedUserReservationRequest;
import ge.evstore.ev_store.response.CartResponse;
import ge.evstore.ev_store.service.interf.CartService;
import ge.evstore.ev_store.service.interf.EmailService;
import ge.evstore.ev_store.service.interf.ReservationService;
import ge.evstore.ev_store.service.interf.UserService;
import ge.evstore.ev_store.utils.JwtUtils;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationServiceImpl implements ReservationService {
    private final EmailService emailService;
    private final UserService userService;
    private final CartService cartService;
    private final JwtUtils jwtUtils;

    @Override
    public void createGuestReservation(final UnauthenticatedUserReservationRequest request) throws MessagingException {
        try {
            emailService.sendReservationMailForUnauthorizedUser(request);
        } catch (final MessagingException e) {
            throw new MessagingException("Messaging Exception during reservation" + e.getMessage());
        }
    }

    @Override
    @Transactional
    @UserTokenAspectMarker
    public void createReservationForUser(final AuthorizedReservationRequest reservationRequest, final String bearer) throws CartNotFoundException, MessagingException {
        try {
            log.info("Creating reservation For user");
            final String username = jwtUtils.extractUsername(bearer);
            final Optional<User> userOptional = userService.findUser(username);
            log.info("Creating reservation for user {}", username);
            if (userOptional.isEmpty()) {
                log.error("User {} not found", username);
                throw new UsernameNotFoundException("User not found for username:" + username);
            }
            final User user = userOptional.get();
            final CartResponse cartForUser = cartService.getCartForUser(bearer);
            final Order order = userService.saveOrderHistory(user, cartForUser);
            emailService.sendReservationMailForUser(user, cartForUser, order.getOrderNumber(), order.getOrderDate(), reservationRequest);
            cartService.clearCartForUser(user);
        } catch (final MessagingException e) {
            throw new MessagingException("Messaging Exception during reservation" + e.getMessage());
        }
    }
}
