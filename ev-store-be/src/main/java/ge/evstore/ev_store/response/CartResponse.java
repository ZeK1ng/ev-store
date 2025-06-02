package ge.evstore.ev_store.response;

import ge.evstore.ev_store.entity.Cart;
import lombok.Data;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Setter
@Data
public class CartResponse {
    private Long cartId;
    private List<CartItemResponse> items;
    private Double cartTotalPrice;

    public static CartResponse fromCart(final Cart cart) {
        final CartResponse response = new CartResponse();
        response.setCartId(cart.getId());

        final List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(CartItemResponse::fromCartItem)
                .collect(Collectors.toList());

        response.setItems(itemResponses);
        // Calculate total price
        final double totalPrice = itemResponses.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        response.setCartTotalPrice(totalPrice);
        return response;
    }
}
