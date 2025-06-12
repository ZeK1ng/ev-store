package ge.evstore.ev_store.controller;

import ge.evstore.ev_store.request.UpdateUserRequest;
import ge.evstore.ev_store.response.OrderHistoryResponse;
import ge.evstore.ev_store.response.UserResponse;
import ge.evstore.ev_store.service.interf.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetUser() {
        // Arrange
        final UserResponse sampleResponse = new UserResponse();
        sampleResponse.setMobile("11111");
        sampleResponse.setFirstName("John Doe");

        when(userService.getUserDetails(any())).thenReturn(sampleResponse);

        // Act
        final ResponseEntity<UserResponse> response = userController.getUser(request);

        // Assert
        assertEquals(ResponseEntity.ok(sampleResponse), response);
        assertEquals("11111", response.getBody().getMobile());
        verify(userService, times(1)).getUserDetails(any());
    }

    @Test
    void testUpdateUser() {
        // Arrange
        final UpdateUserRequest updateUserRequest = new UpdateUserRequest();
        updateUserRequest.setAddress("Addr");

        final UserResponse updatedResponse = new UserResponse();
        updatedResponse.setAddress("Addr");
        updatedResponse.setCity("Tbilisi");

        when(userService.updateUser(any(), any())).thenReturn(updatedResponse);

        // Act
        final ResponseEntity<UserResponse> response = userController.updateUser(updateUserRequest, request);

        // Assert
        assertEquals(ResponseEntity.ok(updatedResponse), response);
        assertEquals("Addr", response.getBody().getAddress());
        verify(userService, times(1)).updateUser(any(),any());
    }

    @Test
    void testGetUserOrderHistory() {
        // Arrange
        final OrderHistoryResponse order1 = new OrderHistoryResponse();
        order1.setOrderId(1L);

        final OrderHistoryResponse order2 = new OrderHistoryResponse();
        order2.setOrderId(2L);

        final List<OrderHistoryResponse> orderHistories = List.of(order1, order2);

        when(userService.getUserOrderHistory(any())).thenReturn(orderHistories);

        // Act
        final ResponseEntity<List<OrderHistoryResponse>> response = userController.getUserOrderHistory(request);

        // Assert
        assertEquals(ResponseEntity.ok(orderHistories), response);
        assertEquals(2, response.getBody().size());
        verify(userService, times(1)).getUserOrderHistory(any());
    }
}