package ge.evstore.ev_store.utils;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Random;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

class CompressionUtilsTest {

    @Test
    void compress_withEmptyByteArray_shouldReturnEmptyCompressedArray() throws IOException {
        // Arrange
        final byte[] emptyData = new byte[0];
        final InputStream emptyInputStream = new ByteArrayInputStream(emptyData);

        // Act
        final byte[] compressed = CompressionUtils.compress(emptyInputStream);

        // Assert
        assertTrue(compressed.length > 0, "Compressed empty array should have metadata");
        final byte[] decompressed = CompressionUtils.decompressImage(compressed);
        assertArrayEquals(emptyData, decompressed, "Decompressed data should match original empty data");
    }

    @Test
    void compress_withSimpleData_shouldCompressAndDecompress() throws IOException {
        // Arrange
        final String original = "Test compression data";
        final byte[] originalData = original.getBytes(StandardCharsets.UTF_8);

        // Act
        final byte[] compressed = CompressionUtils.compress(new ByteArrayInputStream(originalData));
        final byte[] decompressed = CompressionUtils.decompressImage(compressed);

        // Assert
        assertNotEquals(originalData.length, compressed.length, "Compressed data should have different length");
        assertArrayEquals(originalData, decompressed, "Decompressed data should match original data");
        assertEquals(original, new String(decompressed, StandardCharsets.UTF_8), "Decompressed string should match original");
    }

    @Test
    void compress_withRepeatingData_shouldAchieveHighCompressionRatio() throws IOException {
        // Arrange
        final byte[] repeatingData = new byte[10000];
        Arrays.fill(repeatingData, (byte) 65);  // Fill with 'A' character

        // Act
        final byte[] compressed = CompressionUtils.compress(new ByteArrayInputStream(repeatingData));

        // Assert
        assertTrue(compressed.length < repeatingData.length / 10,
                "Compression ratio should be at least 10:1 for repeating data");
        final byte[] decompressed = CompressionUtils.decompressImage(compressed);
        assertArrayEquals(repeatingData, decompressed, "Decompressed data should match original repeating data");
    }

    @Test
    void compress_withRandomData_shouldHaveLowerCompressionRatio() throws IOException {
        // Arrange
        final byte[] randomData = new byte[10000];
        new Random().nextBytes(randomData);

        // Act
        final byte[] compressed = CompressionUtils.compress(new ByteArrayInputStream(randomData));

        // Assert
        // Random data doesn't compress well, but should still be smaller due to metadata optimization
        assertTrue(compressed.length <= randomData.length * 1.1,
                "Random data should not expand significantly after compression");
        final byte[] decompressed = CompressionUtils.decompressImage(compressed);
        assertArrayEquals(randomData, decompressed, "Decompressed data should match original random data");
    }

    @Test
    void compress_withLargeData_shouldCompressAndDecompress() throws IOException {
        // Arrange
        final byte[] largeData = new byte[1000000]; // 1MB of data
        for (int i = 0; i < largeData.length; i++) {
            largeData[i] = (byte) (i % 256);
        }

        final InputStream inputStream = new ByteArrayInputStream(largeData);

        // Act
        final byte[] compressed = CompressionUtils.compress(inputStream);
        final byte[] decompressed = CompressionUtils.decompressImage(compressed);

        // Assert
        assertTrue(compressed.length < largeData.length, "Large data should be compressed to smaller size");
        assertArrayEquals(largeData, decompressed, "Decompressed large data should match original");
    }

    @Test
    void decompressImage_withInvalidData_shouldHandleGracefully() {
        // Arrange
        final byte[] invalidData = "Not a compressed data".getBytes(StandardCharsets.UTF_8);

        // Act & Assert
        assertDoesNotThrow(() -> {
            final byte[] result = CompressionUtils.decompressImage(invalidData);
            // Even with invalid data, it shouldn't throw an exception
            // Result might be garbage, but the method should complete
            assertNotNull(result);
        });
    }

    @Test
    void compressionCycle_multipleTimes_shouldPreserveData() throws IOException {
        // Arrange
        final byte[] originalData = "Test data for multiple compression cycles".getBytes(StandardCharsets.UTF_8);

        // Act - compress and decompress multiple times
        final byte[] compressed1 = CompressionUtils.compress(new ByteArrayInputStream(originalData));
        final byte[] decompressed1 = CompressionUtils.decompressImage(compressed1);
        final byte[] compressed2 = CompressionUtils.compress(new ByteArrayInputStream(decompressed1));
        final byte[] decompressed2 = CompressionUtils.decompressImage(compressed2);
        final byte[] compressed3 = CompressionUtils.compress(new ByteArrayInputStream(decompressed2));
        final byte[] finalDecompressed = CompressionUtils.decompressImage(compressed3);

        // Assert
        assertArrayEquals(originalData, finalDecompressed,
                "Data should be preserved after multiple compression cycles");
    }
}