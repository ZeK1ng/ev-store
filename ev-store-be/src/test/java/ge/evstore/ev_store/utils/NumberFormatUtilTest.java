package ge.evstore.ev_store.utils;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;

class NumberFormatUtilTest {

    @Test
    void roundDouble_withWholeNumber_shouldReturnSameValueWithTwoDecimalPlaces() {
        // Arrange
        final double input = 100.0;
        final BigDecimal expected = new BigDecimal("100.00");

        // Act
        final BigDecimal result = NumberFormatUtil.roundDouble(input);

        // Assert
        assertEquals(expected, result, "Whole numbers should be formatted with two decimal places");
        assertEquals(2, result.scale(), "Result should have scale of 2");
    }

    @Test
    void roundDouble_withExactTwoDecimalPlaces_shouldReturnSameValue() {
        // Arrange
        final double input = 123.45;
        final BigDecimal expected = new BigDecimal("123.45");

        // Act
        final BigDecimal result = NumberFormatUtil.roundDouble(input);

        // Assert
        assertEquals(expected, result, "Numbers with exactly two decimal places should remain unchanged");
        assertEquals(2, result.scale(), "Result should have scale of 2");
    }

    @Test
    void roundDouble_withOneDecimalPlace_shouldAddTrailingZero() {
        // Arrange
        final double input = 99.9;
        final BigDecimal expected = new BigDecimal("99.90");

        // Act
        final BigDecimal result = NumberFormatUtil.roundDouble(input);

        // Assert
        assertEquals(expected, result, "Numbers with one decimal place should get a trailing zero");
        assertEquals(2, result.scale(), "Result should have scale of 2");
    }

    @Test
    void roundDouble_withMoreThanTwoDecimalPlacesRoundingUp_shouldRoundCorrectly() {
        // Arrange
        final double input = 12.345;
        final BigDecimal expected = new BigDecimal("12.35");

        // Act
        final BigDecimal result = NumberFormatUtil.roundDouble(input);

        // Assert
        assertEquals(expected, result, "Numbers with more than two decimal places should round up correctly");
        assertEquals(2, result.scale(), "Result should have scale of 2");
    }

    @Test
    void roundDouble_withMoreThanTwoDecimalPlacesRoundingDown_shouldRoundCorrectly() {
        // Arrange
        final double input = 12.344;
        final BigDecimal expected = new BigDecimal("12.34");

        // Act
        final BigDecimal result = NumberFormatUtil.roundDouble(input);

        // Assert
        assertEquals(expected, result, "Numbers with more than two decimal places should round down correctly");
        assertEquals(2, result.scale(), "Result should have scale of 2");
    }

    @Test
    void roundDouble_withExactlyHalfRounding_shouldRoundUp() {
        // Arrange
        final double input = 12.345;
        final BigDecimal expected = new BigDecimal("12.35");

        // Act
        final BigDecimal result = NumberFormatUtil.roundDouble(input);

        // Assert
        assertEquals(expected, result, "Numbers exactly halfway should round up (HALF_UP mode)");
        assertEquals(2, result.scale(), "Result should have scale of 2");
    }

    @Test
    void roundDouble_withNegativeNumberRoundingUp_shouldRoundCorrectly() {
        // Arrange
        final double input = -12.345;
        final BigDecimal expected = new BigDecimal("-12.35");

        // Act
        final BigDecimal result = NumberFormatUtil.roundDouble(input);

        // Assert
        assertEquals(expected, result, "Negative numbers should round correctly");
        assertEquals(2, result.scale(), "Result should have scale of 2");
    }

    @Test
    void roundDouble_withNegativeNumberRoundingDown_shouldRoundCorrectly() {
        // Arrange
        final double input = -12.344;
        final BigDecimal expected = new BigDecimal("-12.34");

        // Act
        final BigDecimal result = NumberFormatUtil.roundDouble(input);

        // Assert
        assertEquals(expected, result, "Negative numbers should round correctly");
        assertEquals(2, result.scale(), "Result should have scale of 2");
    }

    @Test
    void roundDouble_withZero_shouldReturnZeroWithTwoDecimalPlaces() {
        // Arrange
        final double input = 0.0;
        final BigDecimal expected = new BigDecimal("0.00");

        // Act
        final BigDecimal result = NumberFormatUtil.roundDouble(input);

        // Assert
        assertEquals(expected, result, "Zero should be formatted with two decimal places");
        assertEquals(2, result.scale(), "Result should have scale of 2");
    }

    @Test
    void roundDouble_withVeryLargeNumber_shouldRoundCorrectly() {
        // Arrange
        final double input = 9999999.999;
        final BigDecimal expected = new BigDecimal("10000000.00");

        // Act
        final BigDecimal result = NumberFormatUtil.roundDouble(input);

        // Assert
        assertEquals(expected, result, "Very large numbers should round correctly");
        assertEquals(2, result.scale(), "Result should have scale of 2");
    }

    @Test
    void roundDouble_withVerySmallNumber_shouldRoundCorrectly() {
        // Arrange
        final double input = 0.0049;
        final BigDecimal expected = new BigDecimal("0.00");

        // Act
        final BigDecimal result = NumberFormatUtil.roundDouble(input);

        // Assert
        assertEquals(expected, result, "Very small numbers should round correctly");
        assertEquals(2, result.scale(), "Result should have scale of 2");
    }

    @Test
    void roundDouble_withVerySmallNumberRoundingUp_shouldRoundCorrectly() {
        // Arrange
        final double input = 0.005;
        final BigDecimal expected = new BigDecimal("0.01");

        // Act
        final BigDecimal result = NumberFormatUtil.roundDouble(input);

        // Assert
        assertEquals(expected, result, "Very small numbers at rounding threshold should round correctly");
        assertEquals(2, result.scale(), "Result should have scale of 2");
    }

    @ParameterizedTest
    @MethodSource("provideTestCases")
    void roundDouble_withVariousInputs_shouldRoundCorrectly(final double input, final String expectedString) {
        // Arrange
        final BigDecimal expected = new BigDecimal(expectedString);

        // Act
        final BigDecimal result = NumberFormatUtil.roundDouble(input);

        // Assert
        assertEquals(expected, result, "Rounding should match expected value for input: " + input);
        assertEquals(2, result.scale(), "Result should have scale of 2");
    }

    private static Stream<Arguments> provideTestCases() {
        return Stream.of(
                Arguments.of(1.234, "1.23"),
                Arguments.of(1.235, "1.24"),
                Arguments.of(0.0, "0.00"),
                Arguments.of(123.456789, "123.46"),
                Arguments.of(-5.555, "-5.55"),
                Arguments.of(99.995, "100.00"),
                Arguments.of(0.001, "0.00"),
                Arguments.of(0.009, "0.01"),
                Arguments.of(10.00, "10.00"),
                Arguments.of(999999.99, "999999.99")
        );
    }

    @Test
    void verifyRoundingMode_shouldUseHalfUp() {
        // This test verifies the specific RoundingMode used is HALF_UP

        // Arrange
        final double input = 1.5;

        // Act
        final BigDecimal manualResult = new BigDecimal(input).setScale(0, RoundingMode.HALF_UP);

        // Assert - 1.5 should round up to 2 with HALF_UP mode
        assertEquals(new BigDecimal("2"), manualResult);

        // Similarly, test the util's rounding behavior
        final double testValue = 0.505;
        final BigDecimal utilResult = NumberFormatUtil.roundDouble(testValue);
        assertEquals(new BigDecimal("0.51"), utilResult,
                "Util should use HALF_UP rounding mode (0.505 -> 0.51)");
    }
}