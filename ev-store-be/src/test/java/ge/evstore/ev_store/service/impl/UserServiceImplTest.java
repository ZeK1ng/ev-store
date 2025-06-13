package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.*;
import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.repository.OrderRepository;
import ge.evstore.ev_store.repository.ParametersConfigEntityRepository;
import ge.evstore.ev_store.repository.UserRepository;
import ge.evstore.ev_store.request.CartItemReservationRequest;
import ge.evstore.ev_store.request.UnauthenticatedUserReservationRequest;
import ge.evstore.ev_store.request.UpdateUserRequest;
import ge.evstore.ev_store.request.UserRegisterRequest;
import ge.evstore.ev_store.response.CartItemResponse;
import ge.evstore.ev_store.response.CartResponse;
import ge.evstore.ev_store.response.OrderHistoryResponse;
import ge.evstore.ev_store.response.UserResponse;
import ge.evstore.ev_store.service.interf.ProductService;
import ge.evstore.ev_store.utils.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private ProductService productService;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ParametersConfigEntityRepository configEntityRepository;

    private UserServiceImpl userService;

    private final int VERIFICATION_CODE_DURATION = 30;

    @BeforeEach
    void setUp() {
        final ParameterConfigEntity configEntity = new ParameterConfigEntity();
        configEntity.setVerificationCodeLifeSpanMinutes(VERIFICATION_CODE_DURATION);
        when(configEntityRepository.findById(3L)).thenReturn(Optional.of(configEntity));

        userService = new UserServiceImpl(
                userRepository,
                passwordEncoder,
                jwtUtils,
                productService,
                orderRepository,
                configEntityRepository
        );
    }

    @Test
    void findUser_shouldReturnUserWhenExists() {
        // Arrange
        final String email = "test@example.com";
        final User expectedUser = new User();
        expectedUser.setEmail(email);

        when(userRepository.findByEmail(email.toLowerCase())).thenReturn(Optional.of(expectedUser));

        // Act
        final Optional<User> result = userService.findUser(email);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(email, result.get().getEmail());
        verify(userRepository).findByEmail(email.toLowerCase());
    }

    @Test
    void findUser_shouldReturnEmptyWhenUserDoesNotExist() {
        // Arrange
        final String email = "nonexistent@example.com";
        when(userRepository.findByEmail(email.toLowerCase())).thenReturn(Optional.empty());

        // Act
        final Optional<User> result = userService.findUser(email);

        // Assert
        assertFalse(result.isPresent());
        verify(userRepository).findByEmail(email.toLowerCase());
    }

    @Test
    void registerUserWithoutVerification_shouldCreateNewUser() throws UserAlreadyRegisteredException {
        // Arrange
        final UserRegisterRequest request = createUserRegisterRequest();
        final String verificationCode = "123456";

        when(userRepository.findByEmail(request.getEmail().toLowerCase())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        final User result = userService.registerUserWithoutVerification(request, verificationCode);

        // Assert
        assertNotNull(result);
        assertEquals(request.getFirstName(), result.getFirstName());
        assertEquals(request.getLastName(), result.getLastName());
        assertEquals(request.getEmail().toLowerCase(), result.getEmail());
        assertEquals(request.getMobile(), result.getMobile());
        assertEquals(request.getAddress(), result.getAddress());
        assertEquals(request.getCity(), result.getCity());
        assertEquals("encodedPassword", result.getPassword());
        assertEquals(Role.USER, result.getRole());
        assertEquals(verificationCode, result.getVerificationCode());
        assertFalse(result.getVerified());
        assertNotNull(result.getCreatedAt());

        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUserWithoutVerification_shouldThrowExceptionWhenUserAlreadyExists() {
        // Arrange
        final UserRegisterRequest request = createUserRegisterRequest();
        final String verificationCode = "123456";

        final User existingUser = new User();
        existingUser.setEmail(request.getEmail());
        existingUser.setVerified(true);

        when(userRepository.findByEmail(request.getEmail().toLowerCase())).thenReturn(Optional.of(existingUser));

        // Act & Assert
        assertThrows(UserAlreadyRegisteredException.class, () ->
                userService.registerUserWithoutVerification(request, verificationCode)
        );

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void registerUserWithoutVerification_shouldDeleteAndRecreateUnverifiedUser() throws UserAlreadyRegisteredException {
        // Arrange
        final UserRegisterRequest request = createUserRegisterRequest();
        final String verificationCode = "123456";

        final User existingUser = new User();
        existingUser.setEmail(request.getEmail());
        existingUser.setVerified(false);

        when(userRepository.findByEmail(request.getEmail().toLowerCase())).thenReturn(Optional.of(existingUser));
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        final User result = userService.registerUserWithoutVerification(request, verificationCode);

        // Assert
        assertNotNull(result);

        verify(userRepository).delete(existingUser);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void verifyUser_shouldSetUserAsVerifiedAndCreateCart() {
        // Arrange
        final User user = new User();
        user.setEmail("test@example.com");
        user.setVerified(false);
        user.setVerificationCode("123456");
        user.setOtpVerificationExpiration(LocalDateTime.now().plusMinutes(10));

        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        final User result = userService.verifyUser(user);

        // Assert
        assertNotNull(result);
        assertTrue(result.getVerified());
        assertNull(result.getVerificationCode());
        assertNull(result.getOtpVerificationExpiration());
        assertNotNull(result.getCart());
        assertEquals(user, result.getCart().getUser());

        verify(userRepository).save(user);
    }

    @Test
    void updateVerificationCodeFor_shouldUpdateCodeAndExpiration() {
        // Arrange
        final User user = new User();
        user.setEmail("test@example.com");
        final String newCode = "654321";

        // Act
        userService.updateVerificationCodeFor(user, newCode);

        // Assert
        assertEquals(newCode, user.getVerificationCode());
        assertNotNull(user.getOtpVerificationExpiration());

        verify(userRepository).save(user);
    }

    @Test
    void updatePassword_shouldEncodeAndSaveNewPassword() {
        // Arrange
        final User user = new User();
        user.setEmail("test@example.com");
        user.setVerificationCode("123456");
        user.setOtpVerificationExpiration(LocalDateTime.now());

        final String newPassword = "newPassword123";
        when(passwordEncoder.encode(newPassword)).thenReturn("encodedNewPassword");

        // Act
        userService.updatePassword(user, newPassword);

        // Assert
        assertEquals("encodedNewPassword", user.getPassword());
        assertNull(user.getVerificationCode());
        assertNull(user.getOtpVerificationExpiration());

        verify(passwordEncoder).encode(newPassword);
        verify(userRepository).save(user);
    }

    @Test
    void getUserDetails_shouldReturnUserResponseWhenUserExists() {
        // Arrange
        final String token = "valid.jwt.token";
        final String email = "test@example.com";

        final User user = new User();
        user.setEmail(email);
        user.setFirstName("John");
        user.setLastName("Doe");

        when(jwtUtils.extractUsername(token)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Act
        final UserResponse result = userService.getUserDetails(token);

        // Assert
        assertNotNull(result);
        assertEquals(email, result.getEmail());
        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getLastName());

        verify(jwtUtils).extractUsername(token);
        verify(userRepository).findByEmail(email);
    }

    @Test
    void getUserDetails_shouldReturnNullWhenUserDoesNotExist() {
        // Arrange
        final String token = "valid.jwt.token";
        final String email = "nonexistent@example.com";

        when(jwtUtils.extractUsername(token)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act
        final UserResponse result = userService.getUserDetails(token);

        // Assert
        assertNull(result);

        verify(jwtUtils).extractUsername(token);
        verify(userRepository).findByEmail(email);
    }

    @Test
    void updateUser_shouldUpdateUserDetailsAndReturnResponse() throws UserAlreadyRegisteredException {
        // Arrange
        final String token = "valid.jwt.token";
        final String email = "test@example.com";

        final UpdateUserRequest request = new UpdateUserRequest();
        request.setCity("New York");
        request.setAddress("123 Main St");
        request.setMobile("+1234567890");

        final User user = new User();
        user.setEmail(email);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setCity("Old City");
        user.setAddress("Old Address");
        user.setMobile("OldMobile");

        when(jwtUtils.extractUsername(token)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Act
        final UserResponse result = userService.updateUser(request, token);

        // Assert
        assertNotNull(result);
        assertEquals("New York", user.getCity());
        assertEquals("123 Main St", user.getAddress());
        assertEquals("+1234567890", user.getMobile());

        verify(jwtUtils).extractUsername(token);
        verify(userRepository).findByEmail(email);
        verify(userRepository).save(user);
    }

    @Test
    void updateUser_shouldThrowExceptionWhenUserNotFound() {
        // Arrange
        final String token = "valid.jwt.token";
        final String email = "nonexistent@example.com";

        final UpdateUserRequest request = new UpdateUserRequest();
        request.setCity("New York");

        when(jwtUtils.extractUsername(token)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () ->
                userService.updateUser(request, token)
        );

        verify(jwtUtils).extractUsername(token);
        verify(userRepository).findByEmail(email);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUser_shouldNotSaveWhenNoChanges() throws UserAlreadyRegisteredException {
        // Arrange
        final String token = "valid.jwt.token";
        final String email = "test@example.com";

        final UpdateUserRequest request = new UpdateUserRequest();
        // No properties set in request

        final User user = new User();
        user.setEmail(email);

        when(jwtUtils.extractUsername(token)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        // Act
        final UserResponse result = userService.updateUser(request, token);

        // Assert
        assertNotNull(result);

        verify(jwtUtils).extractUsername(token);
        verify(userRepository).findByEmail(email);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void saveOrderHistory_shouldCreateAndSaveOrder() {
        // Arrange
        final User user = new User();
        user.setEmail("test@example.com");

        final CartResponse cartResponse = new CartResponse();
        final List<CartItemResponse> items = new ArrayList<>();

        final CartItemResponse item1 = new CartItemResponse();
        item1.setProductId(1L);
        item1.setQuantity(2);
        item1.setPrice(10.0);
        items.add(item1);

        final CartItemResponse item2 = new CartItemResponse();
        item2.setProductId(2L);
        item2.setQuantity(1);
        item2.setPrice(15.0);
        items.add(item2);

        cartResponse.setItems(items);

        final Product product1 = new Product();
        product1.setId(1L);
        product1.setNameENG("Product 1");

        final Product product2 = new Product();
        product2.setId(2L);
        product2.setNameENG("Product 2");

        final String specialInstructions = "Please deliver carefully";

        when(productService.getProductById(1L)).thenReturn(product1);
        when(productService.getProductById(2L)).thenReturn(product2);

        // Act
        final Order result = userService.saveOrderHistory(user, cartResponse, specialInstructions);

        // Assert
        assertNotNull(result);
        assertTrue(result.getOrderNumber().startsWith("#ORD-"));
        assertEquals(user, result.getUser());
        assertEquals(OrderStatus.PENDING, result.getStatus());
        assertEquals(specialInstructions, result.getSpecialInstructions());
        assertNotNull(result.getOrderDate());
        assertEquals(35.0, result.getTotalPrice()); // 2*10 + 1*15 = 35
        assertEquals(2, result.getItems().size());

        verify(productService).getProductById(1L);
        verify(productService).getProductById(2L);
        verify(orderRepository).save(result);
    }

    @Test
    void getUserOrderHistory_shouldReturnOrderHistoryResponses() {
        // Arrange
        final String token = "valid.jwt.token";
        final String email = "test@example.com";

        final User user = new User();
        user.setEmail(email);

        final Order order1 = new Order();
        order1.setOrderNumber("#ORD-1");
        order1.setTotalPrice(20.0);
        order1.setOrderDate(LocalDateTime.now());
        order1.setStatus(OrderStatus.COMPLETED);

        final Order order2 = new Order();
        order2.setOrderNumber("#ORD-2");
        order2.setTotalPrice(30.0);
        order2.setOrderDate(LocalDateTime.now());
        order2.setStatus(OrderStatus.PENDING);

        final List<Order> orders = List.of(order1, order2);

        when(jwtUtils.extractUsername(token)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(orderRepository.getOrderByUser(user)).thenReturn(orders);

        // Act
        final List<OrderHistoryResponse> result = userService.getUserOrderHistory(token);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("#ORD-1", result.get(0).getOrderNumber());
        assertEquals("#ORD-2", result.get(1).getOrderNumber());

        verify(jwtUtils).extractUsername(token);
        verify(userRepository).findByEmail(email);
        verify(orderRepository).getOrderByUser(user);
    }

    @Test
    void getUserOrderHistory_shouldThrowExceptionWhenUserNotFound() {
        // Arrange
        final String token = "valid.jwt.token";
        final String email = "nonexistent@example.com";

        when(jwtUtils.extractUsername(token)).thenReturn(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(UsernameNotFoundException.class, () ->
                userService.getUserOrderHistory(token)
        );

        verify(jwtUtils).extractUsername(token);
        verify(userRepository).findByEmail(email);
        verify(orderRepository, never()).getOrderByUser(any(User.class));
    }

    @Test
    void saveOrderHistoryForGuest_shouldCreateAndSaveGuestOrder() {
        // Arrange
        final UnauthenticatedUserReservationRequest request = new UnauthenticatedUserReservationRequest();
        request.setEmail("guest@example.com");
        request.setSpecialInstructions("Leave at door");

        final List<CartItemReservationRequest> cartItems = new ArrayList<>();

        final CartItemReservationRequest item1 = new CartItemReservationRequest();
        item1.setProductId(1L);
        item1.setQuantity(2);
        item1.setProductPrice(10.0);
        cartItems.add(item1);

        final CartItemReservationRequest item2 = new CartItemReservationRequest();
        item2.setProductId(2L);
        item2.setQuantity(1);
        item2.setProductPrice(15.0);
        cartItems.add(item2);

        request.setCartItems(cartItems);

        final Product product1 = new Product();
        product1.setId(1L);
        product1.setNameENG("Product 1");

        final Product product2 = new Product();
        product2.setId(2L);
        product2.setNameENG("Product 2");

        when(productService.getProductById(1L)).thenReturn(product1);
        when(productService.getProductById(2L)).thenReturn(product2);

        final ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);

        // Act
        userService.saveOrderHistoryForGuest(request);

        // Assert
        verify(productService).getProductById(1L);
        verify(productService).getProductById(2L);
        verify(orderRepository).save(orderCaptor.capture());

        final Order savedOrder = orderCaptor.getValue();
        assertNotNull(savedOrder);
        assertTrue(savedOrder.getOrderNumber().startsWith("#ORD-"));
        assertNull(savedOrder.getUser());
        assertEquals(OrderStatus.PENDING, savedOrder.getStatus());
        assertEquals("Leave at door", savedOrder.getSpecialInstructions());
        assertNotNull(savedOrder.getOrderDate());
        assertEquals(35.0, savedOrder.getTotalPrice()); // 2*10 + 1*15 = 35
        assertEquals(2, savedOrder.getItems().size());
    }

    private UserRegisterRequest createUserRegisterRequest() {
        final UserRegisterRequest request = new UserRegisterRequest();
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setMobile("+1234567890");
        request.setAddress("123 Main St");
        request.setCity("New York");
        return request;
    }
}