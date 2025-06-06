package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.request.UnauthenticatedUserReservationRequest;
import ge.evstore.ev_store.service.interf.ReservationService;
import ge.evstore.ev_store.utils.HeaderUtils;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping("/createGuest")
    public ResponseEntity<String> createGuestReservation(@RequestBody final UnauthenticatedUserReservationRequest request) throws MessagingException {
        reservationService.createGuestReservation(request);
        return ResponseEntity.ok("Reservation received and email sent.");
    }

    @PostMapping("/create")
    public ResponseEntity<String> create(final HttpServletRequest httpRequest) throws MessagingException {
        final String bearer = HeaderUtils.extractBearer(httpRequest);
        reservationService.createReservationForUser(bearer);
        return ResponseEntity.ok("Reservation received and email sent.");
    }
}
