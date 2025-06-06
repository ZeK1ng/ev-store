package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.annotation.UserTokenAspectMarker;
import ge.evstore.ev_store.entity.*;
import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.repository.OrderRepository;
import ge.evstore.ev_store.repository.UserRepository;
import ge.evstore.ev_store.request.UserRegisterRequest;
import ge.evstore.ev_store.response.*;
import ge.evstore.ev_store.service.interf.ProductService;
import ge.evstore.ev_store.service.interf.UserService;
import ge.evstore.ev_store.utils.JwtUtils;
import ge.evstore.ev_store.utils.NumberFormatUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final ProductService productService;
    private final OrderRepository orderRepository;
    @Value("${verification.code.expiration.duration.minutes}")
    private int verifyCodeExpirationDuration;
    private static final int SUFFIX_RANDOM_LENGTH = 6;

    public UserServiceImpl(final UserRepository userRepository, final PasswordEncoder passwordEncoder, final JwtUtils jwtUtils, final ProductService productService, final OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.productService = productService;
        this.orderRepository = orderRepository;
    }

    public Optional<User> findUser(final String username) {
        return userRepository.findByEmail(username.toLowerCase());
    }

    @Transactional
    public User registerUserWithoutVerification(final UserRegisterRequest request, final String verificationCode) throws UserAlreadyRegisteredException {
        if (findUser(request.getEmail()).isPresent()) {
            throw new UserAlreadyRegisteredException(request);
        }
        final User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail().toLowerCase());
        user.setMobile(request.getMobile());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setVerificationCode(verificationCode);
        user.setOtpVerificationExpiration(LocalDateTime.now().plusMinutes(verifyCodeExpirationDuration));
        user.setVerified(false);
        user.setCreatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Transactional
    public User verifyUser(final User userFound) {
        userFound.setVerified(true);
        userFound.setVerificationCode(null);
        userFound.setOtpVerificationExpiration(null);
        final Cart cart = new Cart();
        cart.setUser(userFound);
        userFound.setCart(cart);
        return userRepository.save(userFound);
    }

    @Transactional
    public void updateVerificationCodeFor(final User user, final String verificationCode) {
        user.setVerificationCode(verificationCode);
        user.setOtpVerificationExpiration(LocalDateTime.now().plusMinutes(verifyCodeExpirationDuration));
        userRepository.save(user);
    }

    @Transactional
    public void updatePassword(final User user, final String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setVerificationCode(null);
        user.setOtpVerificationExpiration(null);
        userRepository.save(user);
    }

    @Override
    @UserTokenAspectMarker
    public UserResponse getUserDetails(final String accessToken) {
        final String username = jwtUtils.extractUsername(accessToken);
        final Optional<User> user = userRepository.findByEmail(username);
        if (user.isEmpty()) {
            return null;
        }
        final UserResponse userResponse = new UserResponse();
        userResponse.fromUser(user.get());
        return userResponse;
    }

    @Override
    @Transactional
    @UserTokenAspectMarker
    public UserResponse updateUser(final String city, final String address, final String phone, final String token) {
        final String username = jwtUtils.extractUsername(token);
        final Optional<User> user = userRepository.findByEmail(username);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found for name: " + username);
        }
        final User user1 = user.get();
        if (StringUtils.hasText(city)) {
            user1.setCity(city);
        }

        if (StringUtils.hasText(address)) {
            user1.setAddress(address);
        }

        if (StringUtils.hasText(phone)) {
            user1.setMobile(phone);
        }

        userRepository.save(user1);
        final UserResponse userResponse = new UserResponse();
        userResponse.fromUser(user1);
        return userResponse;
    }

    @Override
    public void saveOrderHistory(final User user, final CartResponse cartForUser) {
        final Order order = new Order();

        order.setOrderNumber("#ORD-" + getOrderDateSuffix());
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);

        double totalOrderPrice = 0.0;

        final List<CartItemResponse> items = cartForUser.getItems();
        final List<OrderItem> orderItems = new ArrayList<>();

        for (final CartItemResponse item : items) {
            final OrderItem orderItem = new OrderItem();
            orderItem.setQuantity(item.getQuantity());
            orderItem.setProduct(productService.getProductById(item.getProductId()));
            orderItem.setUnitPrice(item.getPrice());
            final double lineTotal = item.getPrice() * item.getQuantity();
            orderItem.setTotalPrice(lineTotal);
            totalOrderPrice += lineTotal;
            orderItem.setOrder(order);
            orderItems.add(orderItem);
        }

        order.setTotalPrice(totalOrderPrice);
        order.setItems(orderItems);
        order.setUser(user);
        orderRepository.save(order);
    }

    @Override
    @Transactional
    @UserTokenAspectMarker
    public List<OrderHistoryResponse> getUserOrderHistory(final String token) {
        final String username = jwtUtils.extractUsername(token);
        final Optional<User> userOpt = userRepository.findByEmail(username);
        if (userOpt.isEmpty()) {
            throw new UsernameNotFoundException("User not found for name: " + username);
        }
        final User user = userOpt.get();
        final List<Order> orderByUser = orderRepository.getOrderByUser(user);
        final List<OrderHistoryResponse> orderHistoryResponse = new ArrayList<>();
        orderByUser.forEach(order -> {
            orderHistoryResponse.add(createOrderHistory(order));
        });
        return orderHistoryResponse;
    }

    private OrderHistoryResponse createOrderHistory(final Order order) {
        final OrderHistoryResponse orderHistoryResponse = new OrderHistoryResponse();
        orderHistoryResponse.setOrderNumber(order.getOrderNumber());
        orderHistoryResponse.setOrderDate(order.getOrderDate());
        orderHistoryResponse.setTotalPrice(NumberFormatUtil.roundDouble(order.getTotalPrice()));
        orderHistoryResponse.setOrderId(order.getId());
        final List<OrderItemResponse> orderItemResponses = new ArrayList<>();
        final List<OrderItem> items = order.getItems();
        for (final OrderItem orderItem : items) {
            orderItemResponses.add(new OrderItemResponse(orderItem));
        }
        orderHistoryResponse.setItems(orderItemResponses);
        return orderHistoryResponse;
    }

    private String getOrderDateSuffix() {
        final Calendar calendar = Calendar.getInstance();
        final int i = calendar.get(Calendar.YEAR);
        final int i1 = calendar.get(Calendar.MONTH);
        final int i2 = calendar.get(Calendar.DATE);

        return i + "-" + i1 + "-" + i2 + generateRandomString(SUFFIX_RANDOM_LENGTH);
    }


    public static String generateRandomString(final int length) {
        final Random random = new Random();
        final StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            final int randomCharType = random.nextInt(3); // 0: digit, 1: lowercase, 2: uppercase
            final char randomChar = switch (randomCharType) {
                case 0 -> (char) (random.nextInt(10) + '0');
                case 1 -> (char) (random.nextInt(26) + 'a');
                case 2 -> (char) (random.nextInt(26) + 'A');
                default -> ' '; // Should not happen, added for safety
            };
            sb.append(randomChar);
        }
        return sb.toString();
    }

}

