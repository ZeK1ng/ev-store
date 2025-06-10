package ge.evstore.ev_store.request;

import lombok.Data;

@Data
public class AuthorizedReservationRequest {
    private String mobile;
    private String address;
    private String city;
    private String specialInstructions;
}
