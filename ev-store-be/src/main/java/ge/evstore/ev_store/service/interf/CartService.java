package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.response.CartResponse;

public interface CartService {
    CartResponse getCartForUser(String token);

    CartResponse addProductToCart(Long productId, int quantity, String token);

    void clearCart(String token);

    void clearCartForUser(User user);

    void deleteProductFromCart(String productId, String quantity, String token);
}
