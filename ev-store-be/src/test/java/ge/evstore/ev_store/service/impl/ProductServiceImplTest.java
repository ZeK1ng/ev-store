package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.converter.JsonListConverter;
import ge.evstore.ev_store.entity.MaxPriceEasySaver;
import ge.evstore.ev_store.entity.Product;
import ge.evstore.ev_store.exception.ProductNotFoundException;
import ge.evstore.ev_store.repository.MaxPriceSaverRepository;
import ge.evstore.ev_store.repository.ProductRepository;
import ge.evstore.ev_store.response.MaxPriceResponse;
import ge.evstore.ev_store.service.interf.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceImplTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private MaxPriceSaverRepository maxPriceSaverRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private JsonListConverter jsonListConverter;

    private ProductServiceImpl productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        productService = new ProductServiceImpl(productRepository, maxPriceSaverRepository, categoryService, jsonListConverter);
    }

    @Test
    void getProductResponseById_ShouldThrowException_WhenProductDoesNotExist() {
        // Arrange
        final Long productId = 1L;
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // Act & Assert
        final ProductNotFoundException thrown = assertThrows(ProductNotFoundException.class, () -> productService.getProductResponseById(productId));
        assertTrue(thrown.getMessage().contains("Product not found with ID:"));
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    void getProductById_ShouldReturnProduct_WhenProductExists() {
        // Arrange
        final Long productId = 1L;
        final Product mockProduct = new Product();
        mockProduct.setId(productId);
        when(productRepository.findById(productId)).thenReturn(Optional.of(mockProduct));

        // Act
        final Product product = productService.getProductById(productId);

        // Assert
        assertNotNull(product);
        assertEquals(productId, product.getId());
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    void getProductById_ShouldThrowException_WhenProductDoesNotExist() {
        // Arrange
        final Long productId = 1L;
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // Act & Assert
        final ProductNotFoundException thrown = assertThrows(ProductNotFoundException.class, () -> productService.getProductById(productId));
        assertTrue(thrown.getMessage().contains("Product not found with ID:"));
        verify(productRepository, times(1)).findById(productId);
    }

    @Test
    void getOverAllMaxPrice_ShouldReturnMaxPrice_WhenRepositoryHasData() {
        // Arrange
        final MaxPriceEasySaver mockSaver = new MaxPriceEasySaver();
        mockSaver.setMaxPrice(199.99);
        when(maxPriceSaverRepository.findAll()).thenReturn(List.of(mockSaver));

        // Act
        final MaxPriceResponse response = productService.getOverAllMaxPrice();

        // Assert
        assertNotNull(response);
        assertEquals(200.0, response.getMaxPrice()); // MaxPrice is rounded up
        verify(maxPriceSaverRepository, times(1)).findAll();
    }

    @Test
    void getOverAllMaxPrice_ShouldReturnZero_WhenRepositoryIsEmpty() {
        // Arrange
        when(maxPriceSaverRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        final MaxPriceResponse response = productService.getOverAllMaxPrice();

        // Assert
        assertNotNull(response);
        assertEquals(0.0, response.getMaxPrice());
        verify(maxPriceSaverRepository, times(1)).findAll();
    }
}