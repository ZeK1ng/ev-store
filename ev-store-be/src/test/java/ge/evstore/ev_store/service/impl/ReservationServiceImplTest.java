package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.Order;
import ge.evstore.ev_store.entity.User;
import ge.evstore.ev_store.exception.CartNotFoundException;
import ge.evstore.ev_store.request.AuthorizedReservationRequest;
import ge.evstore.ev_store.request.UnauthenticatedUserReservationRequest;
import ge.evstore.ev_store.response.CartResponse;
import ge.evstore.ev_store.service.interf.CartService;
import ge.evstore.ev_store.service.interf.EmailService;
import ge.evstore.ev_store.service.interf.UserService;
import ge.evstore.ev_store.utils.JwtUtils;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class ReservationServiceImplTest {

    @Mock
    private EmailService emailService;

    @Mock
    private UserService userService;

    @Mock
    private CartService cartService;

    @Mock
    private JwtUtils jwtUtils;

    private ReservationServiceImpl reservationService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        reservationService = new ReservationServiceImpl(emailService, userService, cartService, jwtUtils);
    }

    @Test
    void createGuestReservation_ShouldSendEmailAndSaveOrderHistory() throws MessagingException {
        // Arrange
        final UnauthenticatedUserReservationRequest request = new UnauthenticatedUserReservationRequest();
        doNothing().when(userService).saveOrderHistoryForGuest(request);
        doNothing().when(emailService).sendReservationMailForUnauthorizedUser(request);

        // Act
        reservationService.createGuestReservation(request);

        // Assert
        verify(userService, times(1)).saveOrderHistoryForGuest(request);
        verify(emailService, times(1)).sendReservationMailForUnauthorizedUser(request);
    }

    @Test
    void createGuestReservation_ShouldThrowMessagingException() throws MessagingException {
        // Arrange
        final UnauthenticatedUserReservationRequest request = new UnauthenticatedUserReservationRequest();
        doThrow(new MessagingException("Email error")).when(emailService).sendReservationMailForUnauthorizedUser(request);

        // Act & Assert
        final MessagingException thrown = assertThrows(MessagingException.class, () -> reservationService.createGuestReservation(request));
        assertTrue(thrown.getMessage().contains("Messaging Exception during reservation"));
        verify(emailService, times(1)).sendReservationMailForUnauthorizedUser(request);
        verify(userService, times(1)).saveOrderHistoryForGuest(request);
    }

    @Test
    @Transactional
    void createReservationForUser_ShouldCreateReservationSuccessfully() throws CartNotFoundException, MessagingException {
        // Arrange
        final String bearerToken = "mock-bearer-token";
        final String username = "testuser";
        final AuthorizedReservationRequest reservationRequest = mock(AuthorizedReservationRequest.class);
        final CartResponse mockCartResponse = new CartResponse();
        final Order mockOrder = new Order();
        mockOrder.setOrderNumber("12345");

        final User mockUser = new User();
        mockUser.setEmail(username);

        when(jwtUtils.extractUsername(bearerToken)).thenReturn(username);
        when(userService.findUser(username)).thenReturn(Optional.of(mockUser));
        when(cartService.getCartForUser(bearerToken)).thenReturn(mockCartResponse);
        when(userService.saveOrderHistory(mockUser, mockCartResponse, reservationRequest.getSpecialInstructions())).thenReturn(mockOrder);
        doNothing().when(emailService).sendReservationMailForUser(any(User.class), any(CartResponse.class), anyString(), any(), any(AuthorizedReservationRequest.class));
        doNothing().when(cartService).clearCartForUser(mockUser);

        // Act
        reservationService.createReservationForUser(reservationRequest, bearerToken);

        // Assert
        verify(jwtUtils, times(1)).extractUsername(bearerToken);
        verify(userService, times(1)).findUser(username);
        verify(cartService, times(1)).getCartForUser(bearerToken);
        verify(userService, times(1)).saveOrderHistory(mockUser, mockCartResponse, reservationRequest.getSpecialInstructions());
        verify(emailService, times(1)).sendReservationMailForUser(eq(mockUser), eq(mockCartResponse), eq(mockOrder.getOrderNumber()), any(), eq(reservationRequest));
        verify(cartService, times(1)).clearCartForUser(mockUser);
    }

    @Test
    @Transactional
    void createReservationForUser_ShouldThrowUsernameNotFoundException_IfUserNotFound() throws CartNotFoundException, MessagingException {
        // Arrange
        final String bearerToken = "mock-bearer-token";
        final String username = "missinguser";
        final AuthorizedReservationRequest reservationRequest = mock(AuthorizedReservationRequest.class);

        when(jwtUtils.extractUsername(bearerToken)).thenReturn(username);
        when(userService.findUser(username)).thenReturn(Optional.empty());

        // Act & Assert
        final UsernameNotFoundException thrown = assertThrows(UsernameNotFoundException.class, () -> reservationService.createReservationForUser(reservationRequest, bearerToken));
        assertTrue(thrown.getMessage().contains("User not found for username:"));

        verify(jwtUtils, times(1)).extractUsername(bearerToken);
        verify(userService, times(1)).findUser(username);
        verifyNoInteractions(cartService, emailService);
    }

    @Test
    @Transactional
    void createReservationForUser_ShouldThrowMessagingException_IfEmailFails() throws CartNotFoundException, MessagingException {
        // Arrange
        final String bearerToken = "mock-bearer-token";
        final String username = "testuser";
        final AuthorizedReservationRequest reservationRequest = mock(AuthorizedReservationRequest.class);
        final CartResponse mockCartResponse = new CartResponse();
        final Order mockOrder = new Order();
        mockOrder.setOrderNumber("12345");

        final User mockUser = new User();
        mockUser.setEmail(username);

        when(jwtUtils.extractUsername(bearerToken)).thenReturn(username);
        when(userService.findUser(username)).thenReturn(Optional.of(mockUser));
        when(cartService.getCartForUser(bearerToken)).thenReturn(mockCartResponse);
        when(userService.saveOrderHistory(mockUser, mockCartResponse, reservationRequest.getSpecialInstructions())).thenReturn(mockOrder);
        doThrow(new MessagingException("Email sending failed")).when(emailService).sendReservationMailForUser(any(), any(), anyString(), any(), any());

        // Act & Assert
        final MessagingException thrown = assertThrows(MessagingException.class, () -> reservationService.createReservationForUser(reservationRequest, bearerToken));
        assertTrue(thrown.getMessage().contains("Messaging Exception during reservation"));

        verify(jwtUtils, times(1)).extractUsername(bearerToken);
        verify(userService, times(1)).findUser(username);
        verify(cartService, times(1)).getCartForUser(bearerToken);
        verify(userService, times(1)).saveOrderHistory(mockUser, mockCartResponse, reservationRequest.getSpecialInstructions());
        verify(emailService, times(1)).sendReservationMailForUser(any(User.class), any(CartResponse.class), anyString(), any(), any(AuthorizedReservationRequest.class));
    }
}