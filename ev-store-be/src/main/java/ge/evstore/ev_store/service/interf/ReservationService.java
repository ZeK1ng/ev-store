package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.request.AuthorizedReservationRequest;
import ge.evstore.ev_store.request.UnauthenticatedUserReservationRequest;
import jakarta.mail.MessagingException;

public interface ReservationService {
    void createGuestReservation(UnauthenticatedUserReservationRequest request) throws MessagingException;

    void createReservationForUser(AuthorizedReservationRequest reservationRequest, String bearer) throws MessagingException;
}
