package ge.evstore.ev_store.converter;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JsonListConverterTest {

    @InjectMocks
    private JsonListConverter converter;


    @Test
    void convertToDatabaseColumn_withNullList_returnsNull() {
        // Arrange
        List<Long> nullList = null;

        // Act
        String result = converter.convertToDatabaseColumn(nullList);

        // Assert
        assertNull(result);
    }

    @Test
    void convertToDatabaseColumn_withEmptyList_returnsEmptyJsonArray() {
        // Arrange
        List<Long> emptyList = new ArrayList<>();

        // Act
        String result = converter.convertToDatabaseColumn(emptyList);

        // Assert
        assertEquals("[]", result);
    }

    @Test
    void convertToDatabaseColumn_withValidList_returnsJsonString() {
        // Arrange
        List<Long> validList = Arrays.asList(1L, 2L, 3L);

        // Act
        String result = converter.convertToDatabaseColumn(validList);

        // Assert
        assertEquals("[1,2,3]", result);
    }

    @Test
    void convertToEntityAttribute_withNullString_returnsEmptyList() {
        // Arrange
        String nullString = null;

        // Act
        List<Long> result = converter.convertToEntityAttribute(nullString);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void convertToEntityAttribute_withEmptyString_returnsEmptyList() {
        // Arrange
        String emptyString = "";

        // Act
        List<Long> result = converter.convertToEntityAttribute(emptyString);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void convertToEntityAttribute_withBlankString_returnsEmptyList() {
        // Arrange
        String blankString = "   ";

        // Act
        List<Long> result = converter.convertToEntityAttribute(blankString);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void convertToEntityAttribute_withValidJsonArray_returnsLongList() {
        // Arrange
        String jsonArray = "[1,2,3]";

        // Act
        List<Long> result = converter.convertToEntityAttribute(jsonArray);

        // Assert
        assertEquals(3, result.size());
        assertEquals(Arrays.asList(1L, 2L, 3L), result);
    }

    @Test
    void convertToEntityAttribute_withEmptyJsonArray_returnsEmptyList() {
        // Arrange
        String emptyJsonArray = "[]";

        // Act
        List<Long> result = converter.convertToEntityAttribute(emptyJsonArray);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void convertToEntityAttribute_withInvalidJson_throwsRuntimeException() {
        // Arrange
        String invalidJson = "{invalid-json}";

        // Act & Assert
        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> converter.convertToEntityAttribute(invalidJson)
        );
        assertTrue(exception.getMessage().contains("Failed to convert JSON string to list"));
    }

    @Test
    void roundTrip_withValidList_preservesData() {
        // Arrange
        List<Long> originalList = Arrays.asList(1L, 2L, 3L, 4L, 5L);

        // Act
        String dbValue = converter.convertToDatabaseColumn(originalList);
        List<Long> resultList = converter.convertToEntityAttribute(dbValue);

        // Assert
        assertEquals(originalList, resultList);
    }
}