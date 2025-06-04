package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.request.UnauthenticatedUserReservationRequest;

public interface ReservationService {
    void createGuestReservation(UnauthenticatedUserReservationRequest request);
}
