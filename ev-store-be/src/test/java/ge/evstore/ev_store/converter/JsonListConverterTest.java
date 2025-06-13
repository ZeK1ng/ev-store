package ge.evstore.ev_store.converter;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JsonListConverterTest {

    @InjectMocks
    private JsonListConverter converter;


    @Test
    void convertToDatabaseColumn_withNullList_returnsNull() {
        // Arrange
        final List<Long> nullList = null;

        // Act
        final String result = converter.convertToDatabaseColumn(nullList);

        // Assert
        assertNull(result);
    }

    @Test
    void convertToDatabaseColumn_withEmptyList_returnsEmptyJsonArray() {
        // Arrange
        final List<Long> emptyList = new ArrayList<>();

        // Act
        final String result = converter.convertToDatabaseColumn(emptyList);

        // Assert
        assertEquals("[]", result);
    }

    @Test
    void convertToDatabaseColumn_withValidList_returnsJsonString() {
        // Arrange
        final List<Long> validList = Arrays.asList(1L, 2L, 3L);

        // Act
        final String result = converter.convertToDatabaseColumn(validList);

        // Assert
        assertEquals("[1,2,3]", result);
    }

    @Test
    void convertToEntityAttribute_withNullString_returnsEmptyList() {
        // Arrange
        final String nullString = null;

        // Act
        final List<Long> result = converter.convertToEntityAttribute(nullString);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void convertToEntityAttribute_withEmptyString_returnsEmptyList() {
        // Arrange
        final String emptyString = "";

        // Act
        final List<Long> result = converter.convertToEntityAttribute(emptyString);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void convertToEntityAttribute_withBlankString_returnsEmptyList() {
        // Arrange
        final String blankString = "   ";

        // Act
        final List<Long> result = converter.convertToEntityAttribute(blankString);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void convertToEntityAttribute_withValidJsonArray_returnsLongList() {
        // Arrange
        final String jsonArray = "[1,2,3]";

        // Act
        final List<Long> result = converter.convertToEntityAttribute(jsonArray);

        // Assert
        assertEquals(3, result.size());
        assertEquals(Arrays.asList(1L, 2L, 3L), result);
    }

    @Test
    void convertToEntityAttribute_withEmptyJsonArray_returnsEmptyList() {
        // Arrange
        final String emptyJsonArray = "[]";

        // Act
        final List<Long> result = converter.convertToEntityAttribute(emptyJsonArray);

        // Assert
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void convertToEntityAttribute_withInvalidJson_throwsRuntimeException() {
        // Arrange
        final String invalidJson = "{invalid-json}";

        // Act & Assert
        final RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> converter.convertToEntityAttribute(invalidJson)
        );
        assertTrue(exception.getMessage().contains("Failed to convert JSON string to list"));
    }

    @Test
    void roundTrip_withValidList_preservesData() {
        // Arrange
        final List<Long> originalList = Arrays.asList(1L, 2L, 3L, 4L, 5L);

        // Act
        final String dbValue = converter.convertToDatabaseColumn(originalList);
        final List<Long> resultList = converter.convertToEntityAttribute(dbValue);

        // Assert
        assertEquals(originalList, resultList);
    }
}