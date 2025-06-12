package ge.evstore.ev_store.utils;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HeaderUtilsTest {

    @Mock
    private HttpServletRequest request;

    @Test
    void extractBearer_withValidBearerToken_shouldReturnToken() {
        // Arrange
        final String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
        final String authHeader = "Bearer " + token;
        when(request.getHeader("Authorization")).thenReturn(authHeader);

        // Act
        final String extractedToken = HeaderUtils.extractBearer(request);

        // Assert
        assertEquals(token, extractedToken, "Should extract the token correctly from a valid Bearer header");
        verify(request).getHeader("Authorization");
    }

    @Test
    void extractBearer_withNullHeader_shouldReturnNull() {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn(null);

        // Act
        final String extractedToken = HeaderUtils.extractBearer(request);

        // Assert
        assertNull(extractedToken, "Should return null when Authorization header is null");
        verify(request).getHeader("Authorization");
    }

    @Test
    void extractBearer_withNonBearerHeader_shouldReturnNull() {
        // Arrange
        final String authHeader = "Basic dXNlcm5hbWU6cGFzc3dvcmQ=";
        when(request.getHeader("Authorization")).thenReturn(authHeader);

        // Act
        final String extractedToken = HeaderUtils.extractBearer(request);

        // Assert
        assertNull(extractedToken, "Should return null when Authorization header doesn't start with 'Bearer '");
        verify(request).getHeader("Authorization");
    }

    @Test
    void extractBearer_withEmptyHeader_shouldReturnNull() {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn("");

        // Act
        final String extractedToken = HeaderUtils.extractBearer(request);

        // Assert
        assertNull(extractedToken, "Should return null when Authorization header is empty");
        verify(request).getHeader("Authorization");
    }

    @Test
    void extractBearer_withOnlyBearerPrefix_shouldReturnEmptyString() {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn("Bearer ");

        // Act
        final String extractedToken = HeaderUtils.extractBearer(request);

        // Assert
        assertEquals("", extractedToken, "Should return empty string when Authorization header is just 'Bearer '");
        verify(request).getHeader("Authorization");
    }

    @Test
    void extractBearer_withBearerPrefixCaseSensitive_shouldReturnNull() {
        // Arrange
        final String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
        final String authHeader = "bearer " + token; // lowercase 'bearer'
        when(request.getHeader("Authorization")).thenReturn(authHeader);

        // Act
        final String extractedToken = HeaderUtils.extractBearer(request);

        // Assert
        assertNull(extractedToken, "Should return null when 'Bearer' is not correctly capitalized");
        verify(request).getHeader("Authorization");
    }

    @ParameterizedTest
    @MethodSource("provideHeaderVariations")
    void extractBearer_withVariousHeaders_shouldHandleCorrectly(final String header, final String expected) {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn(header);

        // Act
        final String extractedToken = HeaderUtils.extractBearer(request);

        // Assert
        assertEquals(expected, extractedToken, "Should handle the header variation correctly");
        verify(request).getHeader("Authorization");
    }

    private static Stream<Arguments> provideHeaderVariations() {
        return Stream.of(
                Arguments.of("Bearer token123", "token123"),
                Arguments.of("Bearer ", ""),
                Arguments.of("Bearer token with spaces", "token with spaces"),
                Arguments.of("bearer token123", null),
                Arguments.of("Basic auth", null),
                Arguments.of("Token xyz", null),
                Arguments.of("BearerWithoutSpace", null)
        );
    }

    @Test
    void extractBearer_withTokenContainingSpecialChars_shouldExtractCorrectly() {
        // Arrange
        final String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";
        final String authHeader = "Bearer " + token;
        when(request.getHeader("Authorization")).thenReturn(authHeader);

        // Act
        final String extractedToken = HeaderUtils.extractBearer(request);

        // Assert
        assertEquals(token, extractedToken, "Should extract token with special characters correctly");
        verify(request).getHeader("Authorization");
    }

    @Test
    void extractBearer_checkCorrectHeaderName() {
        // Arrange
        when(request.getHeader(anyString())).thenReturn(null);

        // Act
        HeaderUtils.extractBearer(request);

        // Assert
        verify(request).getHeader("Authorization");
        verify(request, never()).getHeader(argThat(name -> !"Authorization".equals(name)));
    }
}