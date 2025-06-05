package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.request.UnauthenticatedUserReservationRequest;
import ge.evstore.ev_store.service.interf.EmailService;
import ge.evstore.ev_store.service.interf.ReservationService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {
    EmailService emailService;

    @Override
    public void createGuestReservation(final UnauthenticatedUserReservationRequest request) throws MessagingException {
        try {
            emailService.sendReservationMailForUnauthorizedUser(request);
        } catch (final MessagingException e) {
            throw new MessagingException("Messaging Exception during reservation" + e.getMessage());
        }
    }
}
