package ge.evstore.ev_store.exceptionHandler;

import ge.evstore.ev_store.exception.*;
import ge.evstore.ev_store.response.GeneralExceptionResponse;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;

import java.nio.file.AccessDeniedException;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class ControllerExceptionHandlerTest {

    @InjectMocks
    private ControllerExceptionHandler exceptionHandler;

    @Test
    void handleUserAlreadyRegisteredException_returnsConflictStatus() {
        // Arrange
        final UserAlreadyRegisteredException exception = new UserAlreadyRegisteredException("Email already registered");

        // Act
        final ResponseEntity<GeneralExceptionResponse> response = exceptionHandler.handleUserAlreadyRegisteredException(exception);

        // Assert
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals("Email already registered", response.getBody().getErrorMessage());
        assertEquals(HttpStatus.CONFLICT.value(), response.getBody().getCode());
    }

    @Test
    void handleVerificationCodeExpiredException_returnsBadRequestStatus() {
        // Arrange
        final VerificationCodeExpiredException exception = new VerificationCodeExpiredException("Verification code expired");

        // Act
        final ResponseEntity<GeneralExceptionResponse> response = exceptionHandler.handleVerificationCodeExpiredException(exception);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Verification code expired", response.getBody().getErrorMessage());
        assertEquals(HttpStatus.BAD_REQUEST.value(), response.getBody().getCode());
    }

    @Test
    void handleVerificationFailedException_returnsForbiddenStatus() {
        // Arrange
        final VerificationFailedException exception = new VerificationFailedException("Verification failed");

        // Act
        final ResponseEntity<GeneralExceptionResponse> response = exceptionHandler.handleAuthenticationException(exception);

        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Verification failed", response.getBody().getErrorMessage());
        assertEquals(HttpStatus.FORBIDDEN.value(), response.getBody().getCode());
    }

    @Test
    void handleMessagingException_returnsInternalServerErrorStatus() {
        // Arrange
        final MessagingException exception = new MessagingException("Failed to send email");

        // Act
        final ResponseEntity<GeneralExceptionResponse> response = exceptionHandler.handleAuthenticationException(exception);

        // Assert
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Failed to send email", response.getBody().getErrorMessage());
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR.value(), response.getBody().getCode());
    }

    @Test
    void handleAccessDeniedException_returnsForbiddenStatus() {
        // Arrange
        final AccessDeniedException exception = new AccessDeniedException("Access denied for this resource");

        // Act
        final ResponseEntity<GeneralExceptionResponse> response = exceptionHandler.handleAccessDeniedException(exception);

        // Assert
        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Access Denied", response.getBody().getErrorMessage());
        assertEquals(HttpStatus.FORBIDDEN.value(), response.getBody().getCode());
    }

    @Test
    void handleAuthenticationFailure_returnsUnauthorizedStatus() {
        // Arrange
        final AuthenticationException exception = new BadCredentialsException("Invalid credentials");

        // Act
        final ResponseEntity<GeneralExceptionResponse> response = exceptionHandler.handleAuthenticationFailure(exception);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("User authentication failed", response.getBody().getErrorMessage());
        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getBody().getCode());
    }

    @Test
    void handleIsParentCategory_returnsBadRequestStatus() {
        // Arrange
        final IsParentCategoryException exception = new IsParentCategoryException("Cannot delete parent category");

        // Act
        final ResponseEntity<GeneralExceptionResponse> response = exceptionHandler.handleIsParentCategory(exception);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Cannot delete parent category", response.getBody().getErrorMessage());
        assertEquals(HttpStatus.BAD_REQUEST.value(), response.getBody().getCode());
    }

    @Test
    void handleEntityNotFound_returnsNotFoundStatus() {
        // Arrange
        final EntityNotFoundException exception = new EntityNotFoundException("Entity not found");

        // Act
        final ResponseEntity<GeneralExceptionResponse> response = exceptionHandler.handleEntityNotFound(exception);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Entity not found", response.getBody().getErrorMessage());
        assertEquals(HttpStatus.NOT_FOUND.value(), response.getBody().getCode());
    }

    @Test
    void handleMalformedJwt_returnsUnauthorizedStatus() {
        // Arrange
        final MalformedJwtException exception = new MalformedJwtException("Malformed JWT token");

        // Act
        final ResponseEntity<GeneralExceptionResponse> response = exceptionHandler.handleMalformedJwt(exception);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Malformed JWT token", response.getBody().getErrorMessage());
        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getBody().getCode());
    }

    @Test
    void handleJwtMismatch_returnsUnauthorizedStatus() {
        // Arrange
        final UnsupportedJwtException exception = new UnsupportedJwtException("Unsupported JWT token");

        // Act
        final ResponseEntity<GeneralExceptionResponse> response = exceptionHandler.handleJwtMismatch(exception);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Unsupported JWT token", response.getBody().getErrorMessage());
        assertEquals(HttpStatus.UNAUTHORIZED.value(), response.getBody().getCode());
    }

    @Test
    void handleCartNotFound_returnsNotFoundStatus() {
        // Arrange
        final CartNotFoundException exception = new CartNotFoundException("Cart not found");

        // Act
        final ResponseEntity<GeneralExceptionResponse> response = exceptionHandler.handleCartNotFound(exception);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Cart not found", response.getBody().getErrorMessage());
        assertEquals(HttpStatus.NOT_FOUND.value(), response.getBody().getCode());
    }

    @Test
    void handleProductNotFound_returnsNotFoundStatus() {
        // Arrange
        final ProductNotFoundException exception = new ProductNotFoundException("Product not found");

        // Act
        final ResponseEntity<GeneralExceptionResponse> response = exceptionHandler.productNotFound(exception);

        // Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals("Product not found", response.getBody().getErrorMessage());
        assertEquals(HttpStatus.NOT_FOUND.value(), response.getBody().getCode());
    }

    @Test
    void handleAmountExceeded_returnsBadRequestStatus() {
        // Arrange
        final AmountExceededException exception = new AmountExceededException("Amount exceeded available stock");

        // Act
        final ResponseEntity<GeneralExceptionResponse> response = exceptionHandler.productNotFound(exception);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Amount exceeded available stock", response.getBody().getErrorMessage());
        assertEquals(HttpStatus.BAD_REQUEST.value(), response.getBody().getCode());
    }
}