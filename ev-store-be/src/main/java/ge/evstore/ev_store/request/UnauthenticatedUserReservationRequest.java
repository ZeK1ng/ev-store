package ge.evstore.ev_store.request;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UnauthenticatedUserReservationRequest {
    private String name;
    private String phone;
    private String city;
    private String address;
    private List<CartItemReservationRequest> cartItems;
    private String email;
    private String specialInstructions;
    private LocalDateTime orderDate;
}
