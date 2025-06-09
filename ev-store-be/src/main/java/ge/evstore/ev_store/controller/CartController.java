package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.response.CartResponse;
import ge.evstore.ev_store.service.interf.CartService;
import ge.evstore.ev_store.utils.HeaderUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/cart-for-user")
    public ResponseEntity<CartResponse> getUserCart(final HttpServletRequest req) {
        final String token = HeaderUtils.extractBearer(req);
        final CartResponse cart = cartService.getCartForUser(token);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addProductToCart(
            final HttpServletRequest req,
            @RequestParam final Long productId,
            @RequestParam(required = false) final Integer quantity) {
        final String token = HeaderUtils.extractBearer(req);
        final CartResponse cartResponse = cartService.addProductToCart(productId, quantity, token);
        return ResponseEntity.ok(cartResponse);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteProductFromCart(final HttpServletRequest req, @RequestParam final Long productId) {
        final String token = HeaderUtils.extractBearer(req);
        cartService.deleteProductFromCart(productId, token);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update")
    public ResponseEntity<CartResponse> updateCart(final HttpServletRequest request, @RequestParam final Long productId, @RequestParam final Integer quantity) {
        final String token = HeaderUtils.extractBearer(request);
        return ResponseEntity.ok(cartService.updateProductQuantityInCart(productId, quantity, token));
    }

}
