package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.response.CartResponse;

public interface CartService {
    CartResponse getCartForUser(String token);

    CartResponse addProductToCart(String productId, String quantity, String token);

    void clearCart(String token);

    void deleteProductFromCart(String productId, String quantity, String token);
}
