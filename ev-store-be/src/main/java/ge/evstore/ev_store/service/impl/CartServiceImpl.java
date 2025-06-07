package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.annotation.UserTokenAspectMarker;
import ge.evstore.ev_store.entity.Cart;
import ge.evstore.ev_store.entity.CartItem;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.AmountExceededException;
import ge.evstore.ev_store.exception.CartNotFoundException;
import ge.evstore.ev_store.repository.CartRepository;
import ge.evstore.ev_store.response.CartResponse;
import ge.evstore.ev_store.service.interf.CartService;
import ge.evstore.ev_store.service.interf.ProductService;
import ge.evstore.ev_store.service.interf.UserService;
import ge.evstore.ev_store.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Iterator;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final ProductService productService;
    private final CartRepository cartRepository;

    @Override
    @UserTokenAspectMarker
    public CartResponse getCartForUser(final String token) {
        final String username = jwtUtils.extractUsername(token);
        final Optional<User> userOptional = userService.findUser(username);
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found for username: " + username);
        }
        final Cart cart = userOptional.get().getCart();
        if (cart == null) {
            throw new CartNotFoundException("Cart not found for user: " + username);
        }
        return CartResponse.fromCart(cart);
    }

    @Override
    @Transactional
    @UserTokenAspectMarker
    public CartResponse addProductToCart(final Long productId, Integer quantity, final String token) {
        final String username = jwtUtils.extractUsername(token);
        final Optional<User> userOptional = userService.findUser(username);
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found for username:" + username);
        }
        final Product productById = productService.getProductById(productId);
        if (quantity == null) {
            quantity = 1;
        }
        //potential quantity check.
        final Cart cart = userOptional.get().getCart();
        final Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productById.getId()))
                .findFirst();

        if (existingItem.isPresent()) {

            final CartItem item = existingItem.get();
            final int newQuantity = item.getQuantity() + quantity;
            final Integer stockAmount = existingItem.get().getProduct().getStockAmount();
            if (stockAmount < newQuantity) {
                throw new AmountExceededException("Amount exceeded for product" + "Max amount is:" + stockAmount);
            }
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            final Integer stockAmount = productById.getStockAmount();
            if (stockAmount < quantity) {
                throw new AmountExceededException("Amount exceeded for product" + "Max amount is:" + stockAmount);
            }
            final CartItem cartItem = new CartItem();
            cartItem.setProduct(productById);
            cartItem.setQuantity(quantity);
            cartItem.setCart(cart);
            cart.getItems().add(cartItem);
        }
        cartRepository.save(cart);
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
    public void deleteProductFromCart(final String productId, final String quantity, final String token) {
        final String username = jwtUtils.extractUsername(token);
        final User user = userService.findUser(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found for username: " + username));

        final Cart cart = user.getCart();
        if (cart == null || cart.getItems() == null) {
            return;
        }

        final Long prodId = Long.parseLong(productId);
        final int qtyToRemove = Integer.parseInt(quantity);

        final Iterator<CartItem> iterator = cart.getItems().iterator();
        while (iterator.hasNext()) {
            final CartItem item = iterator.next();
            if (Objects.equals(item.getProduct().getId(), prodId)) {
                if (item.getQuantity() <= qtyToRemove) {
                    iterator.remove(); // remove item entirely
                } else {
                    item.setQuantity(item.getQuantity() - qtyToRemove); // decrease quantity
                }
                break;
            }
        }
        cartRepository.save(cart);
    }

}
