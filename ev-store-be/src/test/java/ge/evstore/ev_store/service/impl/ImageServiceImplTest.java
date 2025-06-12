package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.ImageEntity;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.repository.ImageRepository;
import ge.evstore.ev_store.repository.ProductRepository;
import ge.evstore.ev_store.response.ImageSaveResponse;
import ge.evstore.ev_store.utils.CompressionUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.MockitoAnnotations;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ImageServiceImplTest {

    @Mock
    private ImageRepository imageRepository;


    @Mock
    private ProductRepository productRepository;

    @Mock
    private MultipartFile multipartFile;

    private ImageServiceImpl imageService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        imageService = new ImageServiceImpl(imageRepository, productRepository);
    }

    @Test
    void saveImage_ShouldSaveImageAndReturnResponse() throws IOException {
        // Arrange
        try (final MockedStatic<CompressionUtils> mockedCompressionUtils = mockStatic(CompressionUtils.class)) {

            final String originalFilename = "test-image.jpg";
            final String contentType = "image/jpeg";
            final byte[] imageBytes = new byte[]{1, 2, 3};
            final byte[] compressedBytes = new byte[]{10, 20, 30};
            final ImageEntity mockImageEntity = ImageEntity.builder()
                    .id(1L)
                    .name(originalFilename)
                    .type(contentType)
                    .image(compressedBytes)
                    .build();

            when(multipartFile.getOriginalFilename()).thenReturn(originalFilename);
            when(multipartFile.getContentType()).thenReturn(contentType);
            when(multipartFile.getBytes()).thenReturn(imageBytes);
            mockedCompressionUtils.when(() -> CompressionUtils.compress(imageBytes)).thenReturn(compressedBytes);
            when(imageRepository.save(any())).thenReturn(mockImageEntity);
            // Act
            final ImageSaveResponse response = imageService.saveImage(multipartFile);

            // Assert
            assertNotNull(response);
            assertEquals(1L, response.getImageId());
            assertEquals(originalFilename, response.getImageName());
            assertEquals(compressedBytes.length, response.getImageSize());

            final ArgumentCaptor<ImageEntity> imageEntityArgumentCaptor = ArgumentCaptor.forClass(ImageEntity.class);
            verify(imageRepository).save(imageEntityArgumentCaptor.capture());
            final ImageEntity savedEntity = imageEntityArgumentCaptor.getValue();
            assertEquals(originalFilename, savedEntity.getName());
            assertEquals(contentType, savedEntity.getType());
            assertEquals(compressedBytes, savedEntity.getImage());
        }
    }

    @Test
    void saveImage_ShouldThrowIOException() throws IOException {
        // Arrange
        when(multipartFile.getBytes()).thenThrow(new IOException("File error"));

        // Act & Assert
        final IOException thrown = assertThrows(IOException.class, () -> imageService.saveImage(multipartFile));
        assertEquals("File error", thrown.getMessage());
        verifyNoInteractions(imageRepository);
    }

    @Test
    void getImageById_ShouldReturnNull_WhenImageDoesNotExist() {
        // Arrange
        final Long imageId = 1L;
        when(imageRepository.findById(imageId)).thenReturn(Optional.empty());

        // Act
        final byte[] result = imageService.getImageById(imageId);

        // Assert
        assertNull(result);
        verify(imageRepository, times(1)).findById(imageId);
    }

    @Test
    void getImageById_ShouldReturnNull_WhenImageIdIsNegative() {
        // Arrange
        final Long imageId = -1L;

        // Act
        final byte[] result = imageService.getImageById(imageId);

        // Assert
        assertNull(result);
        verifyNoInteractions(imageRepository);
    }

    @Test
    void deleteOrphanImages_ShouldDeleteImagesWithNoProducts() {
        // Arrange
        final ImageEntity mockImage1 = ImageEntity.builder().id(1L).build();
        final ImageEntity mockImage2 = ImageEntity.builder().id(2L).build();
        final List<ImageEntity> allImages = List.of(mockImage1, mockImage2);

        when(imageRepository.findAll()).thenReturn(allImages);
        when(productRepository.findByImageId(1L)).thenReturn(Collections.emptyList());
        when(productRepository.findByImageId(2L)).thenReturn(Collections.singletonList(new Product()));

        // Act
        final int result = imageService.deleteOrphanImages();

        // Assert
        assertEquals(1, result);
        verify(imageRepository, times(1)).findAll();
        verify(productRepository, times(1)).findByImageId(1L);
        verify(productRepository, times(1)).findByImageId(2L);
        verify(imageRepository, times(1)).delete(mockImage1);
        verify(imageRepository, never()).delete(mockImage2);
    }

    @Test
    void deleteOrphanImages_ShouldReturnZero_WhenNoOrphanImagesExist() {
        // Arrange
        final ImageEntity mockImage1 = ImageEntity.builder().id(1L).build();
        final List<ImageEntity> allImages = List.of(mockImage1);

        when(imageRepository.findAll()).thenReturn(allImages);
        when(productRepository.findByImageId(1L)).thenReturn(Collections.singletonList(new Product()));

        // Act
        final int result = imageService.deleteOrphanImages();

        // Assert
        assertEquals(0, result);
        verify(imageRepository, times(1)).findAll();
        verify(productRepository, times(1)).findByImageId(1L);
        verify(imageRepository, never()).delete(any());
    }
}