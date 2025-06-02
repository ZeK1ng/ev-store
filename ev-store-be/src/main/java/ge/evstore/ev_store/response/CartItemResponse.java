package ge.evstore.ev_store.response;

import ge.evstore.ev_store.entity.CartItem;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CartItemResponse {
    private Long productId;
    private String productNameGE;
    private String productNameRUS;
    private String productNameENG;
    private int quantity;
    private double price;

    public static CartItemResponse fromCartItem(final CartItem item) {
        final CartItemResponse response = new CartItemResponse();
        response.setProductId(item.getProduct().getId());
        response.setProductNameGE(item.getProduct().getNameGE());
        response.setProductNameENG(item.getProduct().getNameENG());
        response.setProductNameRUS(item.getProduct().getNameRUS());
        response.setQuantity(item.getQuantity());
        response.setPrice(item.getProduct().getPrice());
        return response;
    }
}
