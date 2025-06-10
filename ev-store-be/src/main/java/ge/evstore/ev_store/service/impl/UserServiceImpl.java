package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.annotation.UserTokenAspectMarker;
import ge.evstore.ev_store.entity.*;
import ge.evstore.ev_store.exception.UserAlreadyRegisteredException;
import ge.evstore.ev_store.repository.OrderRepository;
import ge.evstore.ev_store.repository.ParametersConfigEntityRepository;
import ge.evstore.ev_store.repository.UserRepository;
import ge.evstore.ev_store.request.CartItemReservationRequest;
import ge.evstore.ev_store.request.UnauthenticatedUserReservationRequest;
import ge.evstore.ev_store.request.UserRegisterRequest;
import ge.evstore.ev_store.response.CartItemResponse;
import ge.evstore.ev_store.response.CartResponse;
import ge.evstore.ev_store.response.OrderHistoryResponse;
import ge.evstore.ev_store.response.UserResponse;
import ge.evstore.ev_store.service.interf.ProductService;
import ge.evstore.ev_store.service.interf.UserService;
import ge.evstore.ev_store.utils.JwtUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static ge.evstore.ev_store.utils.OrderUtils.generateOrderNumber;

@Service
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final ProductService productService;
    private final OrderRepository orderRepository;
    private final int verifyCodeExpirationDuration;


    public UserServiceImpl(final UserRepository userRepository, final PasswordEncoder passwordEncoder, final JwtUtils jwtUtils, final ProductService productService, final OrderRepository orderRepository, final ParametersConfigEntityRepository configEntityRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.productService = productService;
        this.orderRepository = orderRepository;
        this.verifyCodeExpirationDuration = configEntityRepository.findById(3L).get().getVerificationCodeLifeSpanMinutes();
    }

    public Optional<User> findUser(final String username) {
        return userRepository.findByEmail(username.toLowerCase());
    }

    @Transactional
    public User registerUserWithoutVerification(final UserRegisterRequest request, final String verificationCode) throws UserAlreadyRegisteredException {
        log.info("Registering user without verification code {}", verificationCode);
        final Optional<User> user1 = findUser(request.getEmail());
        if (user1.isPresent() && user1.get().getVerified()) {
            log.info("Verified User {} already exists", request.getEmail());
            throw new UserAlreadyRegisteredException(request);
        } else {
            user1.ifPresent(userRepository::delete);
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
        log.info("Verifying user {}", userFound.getEmail());
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
        log.info("Updating verification code for user {}", user.getEmail());
        user.setVerificationCode(verificationCode);
        user.setOtpVerificationExpiration(LocalDateTime.now().plusMinutes(verifyCodeExpirationDuration));
        userRepository.save(user);
    }

    @Transactional
    public void updatePassword(final User user, final String newPassword) {
        log.info("Updating password for user {}", user.getEmail());
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
        log.info("Retrieved user {}", username);
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
    public UserResponse updateUser(final String city, final String address, final String mobile, final String token) throws UserAlreadyRegisteredException {
        log.info("Updating user city: {}, address: {}, mobile: {}", city, address, mobile);
        final String username = jwtUtils.extractUsername(token);
        final Optional<User> user = userRepository.findByEmail(username);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found for name: " + username);
        }
        boolean changed = false;
        final User user1 = user.get();
        if (StringUtils.hasText(city)) {
            user1.setCity(city);
            changed = true;
        }

        if (StringUtils.hasText(address)) {
            user1.setAddress(address);
            changed = true;
        }

        if (StringUtils.hasText(mobile)) {
            user1.setMobile(mobile);
            changed = true;
        }
        if (changed) {
            userRepository.save(user1);
        }
        final UserResponse userResponse = new UserResponse();
        userResponse.fromUser(user1);
        return userResponse;
    }

    @Override
    public Order saveOrderHistory(final User user, final CartResponse cartForUser, final String specialInstructions) {
        log.info("Saving order history for user {}", user.getEmail());
        final Order order = new Order();

        order.setOrderNumber(generateOrderNumber());
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setSpecialInstructions(specialInstructions);
        order.setOrderDate(LocalDateTime.now());

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
        return order;
    }

    @Override
    @Transactional
    @UserTokenAspectMarker
    public List<OrderHistoryResponse> getUserOrderHistory(final String token) {
        log.info("Retrieving user order history for token {}", token);
        final String username = jwtUtils.extractUsername(token);
        final Optional<User> userOpt = userRepository.findByEmail(username);
        if (userOpt.isEmpty()) {
            log.error("User not found for name: " + username);
            throw new UsernameNotFoundException("User not found for name: " + username);
        }
        final User user = userOpt.get();
        final List<Order> orderByUser = orderRepository.getOrderByUser(user);
        final List<OrderHistoryResponse> orderHistoryResponse = new ArrayList<>();
        orderByUser.forEach(order -> {
            orderHistoryResponse.add(OrderHistoryResponse.createFrom(order));
        });
        return orderHistoryResponse;
    }

    @Override
    @Transactional
    public void saveOrderHistoryForGuest(final UnauthenticatedUserReservationRequest request) {
        log.info("Saving order history for guest user {}", request.getEmail());
        final Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDateTime.now());
        order.setUser(null);
        order.setSpecialInstructions(request.getSpecialInstructions());
        final List<OrderItem> orderItems = new ArrayList<>();
        double totalOrderPrice = 0.0;
        for (final CartItemReservationRequest item : request.getCartItems()) {
            final OrderItem orderItem = new OrderItem();
            orderItem.setQuantity(item.getQuantity());
            orderItem.setProduct(productService.getProductById(item.getProductId()));
            orderItem.setUnitPrice(item.getProductPrice());
            final double lineTotal = item.getProductPrice() * item.getQuantity();
            totalOrderPrice += lineTotal;
            orderItem.setTotalPrice(lineTotal);
            orderItem.setOrder(order);
            orderItems.add(orderItem);
        }
        order.setTotalPrice(totalOrderPrice);
        order.setItems(orderItems);
        orderRepository.save(order);
    }

}

