package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.Cart;
import ge.evstore.ev_store.entity.CartItem;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.CartNotFoundException;
import ge.evstore.ev_store.repository.CartRepository;
import ge.evstore.ev_store.response.CartResponse;
import ge.evstore.ev_store.service.interf.ProductService;
import ge.evstore.ev_store.service.interf.UserService;
import ge.evstore.ev_store.utils.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CartServiceImplTest {

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserService userService;

    @Mock
    private ProductService productService;

    @Mock
    private CartRepository cartRepository;

    private CartServiceImpl cartService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        cartService = new CartServiceImpl(jwtUtils, userService, productService, cartRepository);
    }

    @Test
    void getCartForUser_ShouldReturnCartResponse_WhenValidUser() {
        // Arrange
        final String token = "test-token";
        final String username = "testUser";

        final Cart mockCart = new Cart();
        final User mockUser = new User();
        mockUser.setCart(mockCart);

        when(jwtUtils.extractUsername(token)).thenReturn(username);
        when(userService.findUser(username)).thenReturn(Optional.of(mockUser));

        // Act
        final CartResponse response = cartService.getCartForUser(token);

        // Assert
        assertNotNull(response);
        verify(userService, times(1)).findUser(username);
    }

    @Test
    void getCartForUser_ShouldThrowUsernameNotFoundException_WhenUserNotFound() {
        // Arrange
        final String token = "invalid-token";
        final String username = "unknownUser";

        when(jwtUtils.extractUsername(token)).thenReturn(username);
        when(userService.findUser(username)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () -> cartService.getCartForUser(token));
        verify(userService, times(1)).findUser(username);
    }

    @Test
    void getCartForUser_ShouldThrowCartNotFoundException_WhenCartIsNull() {
        // Arrange
        final String token = "test-token";
        final String username = "testUser";

        final User mockUser = new User();
        mockUser.setCart(null);

        when(jwtUtils.extractUsername(token)).thenReturn(username);
        when(userService.findUser(username)).thenReturn(Optional.of(mockUser));

        // Act & Assert
        assertThrows(CartNotFoundException.class, () -> cartService.getCartForUser(token));
    }
}