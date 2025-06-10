package ge.evstore.ev_store.response;

import ge.evstore.ev_store.entity.CartItem;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CartItemResponse {
    private Long productId;
    private String nameGE;
    private String nameRUS;
    private String nameENG;
    private String descriptionGE;
    private String descriptionENG;
    private String descriptionRUS;
    private int quantity;
    private double price;
    private Long mainImageId;

    public static CartItemResponse fromCartItem(final CartItem item) {
        final CartItemResponse response = new CartItemResponse();
        response.setProductId(item.getProduct().getId());
        response.setNameGE(item.getProduct().getNameGE());
        response.setNameENG(item.getProduct().getNameENG());
        response.setNameRUS(item.getProduct().getNameRUS());
        response.setDescriptionGE(item.getProduct().getDescriptionGE());
        response.setDescriptionENG(item.getProduct().getDescriptionENG());
        response.setDescriptionRUS(item.getProduct().getDescriptionRUS());
        response.setQuantity(item.getQuantity());
        response.setPrice(item.getProduct().getPrice());
        response.setMainImageId(item.getProduct().getMainImageId());
        return response;
    }
}
