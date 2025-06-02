package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.response.CartResponse;

public interface CartService {
    CartResponse getCartForUser(String token);

    CartResponse addProductToCart(String token, String productId, String quantity);

    void clearCart(String token);

    void deleteProductFromCart(String token, String productId, String quantity);
}
