package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.request.AuthorizedReservationRequest;
import ge.evstore.ev_store.request.UnauthenticatedUserReservationRequest;
import ge.evstore.ev_store.response.GeneralExceptionResponse;
import ge.evstore.ev_store.service.interf.ReservationService;
import ge.evstore.ev_store.utils.HeaderUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/reservation")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @Operation(summary = "Create a reservation for a guest user", description = "Allows unauthenticated users to place a reservation and sends a confirmation email to the provided email address.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully created a reservation and sent a confirmation email."),
            @ApiResponse(responseCode = "400", description = "Bad request, such as invalid reservation details.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error occurred while processing the request.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping("/create-guest")
    public ResponseEntity<String> createGuestReservation(@RequestBody final UnauthenticatedUserReservationRequest request) throws MessagingException {
        reservationService.createGuestReservation(request);
        request.setOrderDate(LocalDateTime.now());
        return ResponseEntity.ok("Reservation received and email sent.");
    }

    @Operation(summary = "Create a reservation for an authenticated user", description = "Allows authenticated users to place a reservation and sends a confirmation email to the registered email address.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully created a reservation and sent a confirmation email."),
            @ApiResponse(responseCode = "400", description = "Bad request, such as invalid reservation details.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized. Token is missing or invalid.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error occurred while processing the request.",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = GeneralExceptionResponse.class)))
    })
    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody final AuthorizedReservationRequest reservationRequest, final HttpServletRequest httpRequest) throws MessagingException {
        final String bearer = HeaderUtils.extractBearer(httpRequest);
        reservationService.createReservationForUser(reservationRequest, bearer);
        return ResponseEntity.ok("Reservation received and email sent.");
    }
}