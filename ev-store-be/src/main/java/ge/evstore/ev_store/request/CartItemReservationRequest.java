package ge.evstore.ev_store.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemReservationRequest {
    private int quantity;
    private Long productId;
    private String productName;
    private Double productPrice;
}
