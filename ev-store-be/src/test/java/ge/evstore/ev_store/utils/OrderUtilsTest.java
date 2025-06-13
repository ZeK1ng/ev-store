package ge.evstore.ev_store.utils;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.time.LocalDate;
import java.util.Calendar;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class OrderUtilsTest {

    @Test
    void generateOrderNumber_shouldStartWithHashOrdPrefix() {
        // Act
        final String orderNumber = OrderUtils.generateOrderNumber();

        // Assert
        assertTrue(orderNumber.startsWith("#ORD-"), "Order number should start with '#ORD-'");
    }

    @Test
    void generateOrderNumber_shouldContainDateAndRandomSuffix() {
        // Arrange
        final Calendar calendar = Calendar.getInstance();
        final int year = calendar.get(Calendar.YEAR);
        final int month = calendar.get(Calendar.MONTH);
        final int day = calendar.get(Calendar.DATE);
        final String datePattern = year + "-" + month + "-" + day + "-";

        // Act
        final String orderNumber = OrderUtils.generateOrderNumber();

        // Assert
        assertTrue(orderNumber.contains(datePattern),
                "Order number should contain current date in format 'YYYY-MM-DD'");

        // Extract suffix to verify it's the correct length
        final String suffix = orderNumber.substring(orderNumber.lastIndexOf("-") + 1);
        assertEquals(6, suffix.length(), "Random suffix should be 6 characters long");
    }

    @Test
    void getOrderDateSuffix_shouldReturnCorrectDateFormat() {
        // Arrange
        final Calendar calendar = Calendar.getInstance();
        final int year = calendar.get(Calendar.YEAR);
        final int month = calendar.get(Calendar.MONTH);
        final int day = calendar.get(Calendar.DATE);
        final String expectedDatePrefix = year + "-" + month + "-" + day + "-";

        // Act
        final String dateSuffix = OrderUtils.getOrderDateSuffix();

        // Assert
        assertTrue(dateSuffix.startsWith(expectedDatePrefix),
                "Date suffix should start with current date in format 'YYYY-MM-DD'");

        assertEquals(expectedDatePrefix.length() + 6, dateSuffix.length(),
                "Date suffix should be date format plus 6 random characters");
    }

    @ParameterizedTest
    @ValueSource(ints = {1, 5, 10, 20})
    void generateRandomOrderSuffixString_shouldGenerateStringOfSpecifiedLength(final int length) {
        // Act
        final String randomSuffix = OrderUtils.generateRandomOrderSuffixString(length);

        // Assert
        assertEquals(length, randomSuffix.length(),
                "Random suffix should be exactly the specified length");
    }

    @Test
    void generateRandomOrderSuffixString_shouldGenerateAlphanumericCharactersOnly() {
        // Act
        final String randomSuffix = OrderUtils.generateRandomOrderSuffixString(100); // Large sample for better testing

        // Assert
        assertTrue(randomSuffix.matches("[a-zA-Z0-9]+"),
                "Random suffix should contain only alphanumeric characters");
    }

    @Test
    void generateRandomOrderSuffixString_shouldGenerateAllPossibleCharacterTypes() {
        // This test ensures that digits, lowercase, and uppercase letters can all be generated
        // We'll generate a large sample to increase the chance of having all types

        // Act
        final String randomSuffix = OrderUtils.generateRandomOrderSuffixString(1000);

        // Assert
        assertTrue(Pattern.compile("[0-9]").matcher(randomSuffix).find(),
                "Random suffix should contain at least one digit");
        assertTrue(Pattern.compile("[a-z]").matcher(randomSuffix).find(),
                "Random suffix should contain at least one lowercase letter");
        assertTrue(Pattern.compile("[A-Z]").matcher(randomSuffix).find(),
                "Random suffix should contain at least one uppercase letter");
    }

    @Test
    void generateOrderNumber_shouldBeUnique() {
        // Generate multiple order numbers and ensure they're all unique
        // Act
        final Set<String> orderNumbers = new HashSet<>();
        for (int i = 0; i < 100; i++) {
            orderNumbers.add(OrderUtils.generateOrderNumber());
        }

        // Assert
        assertEquals(100, orderNumbers.size(),
                "100 generated order numbers should all be unique");
    }

    @Test
    void getOrderDateSuffix_shouldReflectCurrentDate() {
        // Arrange
        final LocalDate today = LocalDate.now();
        final String expectedYearMonth = today.getYear() + "-" + (today.getMonthValue() - 1); // Calendar months are 0-based

        // Act
        final String dateSuffix = OrderUtils.getOrderDateSuffix();

        // Assert
        assertTrue(dateSuffix.startsWith(expectedYearMonth),
                "Date suffix should reflect the current year and month");
    }

    @Test
    void generateRandomOrderSuffixString_withZeroLength_shouldReturnEmptyString() {
        // Act
        final String result = OrderUtils.generateRandomOrderSuffixString(0);

        // Assert
        assertEquals("", result, "Should return empty string for length 0");
    }

    @Test
    void generateRandomOrderSuffixString_withNegativeLength_shouldHandleGracefully() {
        // Act
        final String result = OrderUtils.generateRandomOrderSuffixString(-5);

        // Assert
        assertEquals("", result, "Should return empty string for negative length");
    }
}