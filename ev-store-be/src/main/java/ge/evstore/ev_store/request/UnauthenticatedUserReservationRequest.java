package ge.evstore.ev_store.request;

import lombok.Data;

import java.util.List;

@Data
public class UnauthenticatedUserReservationRequest {
    private String name;
    private String mobile;
    private String city;
    private String address;
    private List<CartItemReservationRequest> cartItems;
}
