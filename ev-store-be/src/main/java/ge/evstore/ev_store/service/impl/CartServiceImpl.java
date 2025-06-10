package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.annotation.UserTokenAspectMarker;
import ge.evstore.ev_store.entity.Cart;
import ge.evstore.ev_store.entity.CartItem;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.CartNotFoundException;
import ge.evstore.ev_store.repository.CartRepository;
import ge.evstore.ev_store.response.CartResponse;
import ge.evstore.ev_store.service.interf.CartService;
import ge.evstore.ev_store.service.interf.ProductService;
import ge.evstore.ev_store.service.interf.UserService;
import ge.evstore.ev_store.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartServiceImpl implements CartService {
    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final ProductService productService;
    private final CartRepository cartRepository;

    @Override
    @UserTokenAspectMarker
    public CartResponse getCartForUser(final String token) {
        final String username = jwtUtils.extractUsername(token);
        log.info("Fetching cart for user: {}", username);

        final Optional<User> userOptional = userService.findUser(username);
        if (userOptional.isEmpty()) {
            log.warn("User not found for username: {}", username);
            throw new UsernameNotFoundException("User not found for username: " + username);
        }
        final Cart cart = userOptional.get().getCart();
        if (cart == null) {
            log.warn("Cart not found for user: {}", username);
            throw new CartNotFoundException("Cart not found for user: " + username);
        }
        log.info("Cart found for user: {}", username);
        return CartResponse.fromCart(cart);
    }

    @Override
    @Transactional
    @UserTokenAspectMarker
    public CartResponse addProductToCart(final Long productId, final Integer quantity, final String token) {
        final String username = jwtUtils.extractUsername(token);
        log.info("Add product to cart requested. User: {}, ProductId: {}, Quantity: {}", username, productId, quantity);

        final Optional<User> userOptional = userService.findUser(username);
        if (userOptional.isEmpty()) {
            log.warn("User not found for username: {}", username);
            throw new UsernameNotFoundException("User not found for username: " + username);
        }

        final Product productById = productService.getProductById(productId);
        log.debug("Product retrieved: {} (ID: {})", productById.getNameENG(), productId);

        final Cart cart = userOptional.get().getCart();
        if (cart == null) {
            log.warn("Cart not found for user: {}", username);
            throw new CartNotFoundException("Cart not found for user: " + username);
        }

        final Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productById.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            final CartItem item = existingItem.get();
            final int oldQuantity = item.getQuantity();
            item.setQuantity(oldQuantity + quantity);
            log.info("Updated quantity for product ID {} in cart from {} to {}", productId, oldQuantity, item.getQuantity());
        } else {
            // Uncomment if you want to enforce stock amount check
            // final Integer stockAmount = productById.getStockAmount();
            // if (stockAmount < quantity) {
            //     log.warn("Requested quantity {} exceeds stock amount {} for product ID {}", quantity, stockAmount, productId);
            //     throw new AmountExceededException("Amount exceeded for product. Max amount is: " + stockAmount);
            // }

            final CartItem cartItem = new CartItem();
            cartItem.setProduct(productById);
            cartItem.setQuantity(quantity);
            cartItem.setCart(cart);
            cart.getItems().add(cartItem);
            log.info("Added new product ID {} with quantity {} to cart for user {}", productId, quantity, username);
        }

        cartRepository.save(cart);
        log.info("Cart saved successfully for user: {}", username);

        return CartResponse.fromCart(cart);
    }

    @Override
    @Transactional
    @UserTokenAspectMarker
    public void clearCart(final String token) {
        final String username = jwtUtils.extractUsername(token);
        final User user = userService.findUser(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found for username: " + username));

        final Cart cart = user.getCart();
        if (cart != null && cart.getItems() != null) {
            cart.getItems().clear();
            cartRepository.save(cart); // to persist the change
        }
    }

    @Override
    @Transactional
    public void clearCartForUser(final User user) {
        final Cart cart = user.getCart();
        if (cart != null && cart.getItems() != null) {
            cart.getItems().clear();
            cartRepository.save(cart); // to persist the change
        }
    }


    @Override
    @Transactional
    @UserTokenAspectMarker
    public void deleteProductFromCart(final Long productId, final String token) {
        final String username = jwtUtils.extractUsername(token);
        final User user = userService.findUser(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found for username: " + username));

        final Cart cart = user.getCart();
        if (cart == null || cart.getItems() == null) {
            return;
        }
        cart.getItems().removeIf(item -> Objects.equals(item.getProduct().getId(), productId));
        cartRepository.save(cart);
    }

    @Override
    @Transactional
    @UserTokenAspectMarker
    public CartResponse updateProductQuantityInCart(final Long productId, final Integer quantity, final String token) {
        final String username = jwtUtils.extractUsername(token);
        final User user = userService.findUser(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found for username: " + username));

        final Cart cart = user.getCart();
        for (final CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(productId)) {
                item.setQuantity(quantity);
            }
        }
        return CartResponse.fromCart(cartRepository.save(cart));
    }

}
