package ge.evstore.ev_store.request;

import lombok.Data;

@Data
public class CartItemReservationRequest {
    private int quantity;
    private Long productId;
    private String productName;
    private Double productPrice;
}
