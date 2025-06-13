package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.repository.CategoryRepository;
import ge.evstore.ev_store.response.CategoryFullTreeResponse;
import ge.evstore.ev_store.response.CategoryWithoutChildren;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CategoryServiceImplTest {

    @Mock
    private CategoryRepository categoryRepository;

    private CategoryServiceImpl categoryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        categoryService = new CategoryServiceImpl(categoryRepository);
    }

    @Test
    void getAllCategories_ShouldReturnFullCategoryTree() {
        // Arrange
        final Category rootCategory1 = new Category();
        rootCategory1.setId(1L);
        rootCategory1.setName("Category 1");

        final Category rootCategory2 = new Category();
        rootCategory2.setId(2L);
        rootCategory2.setName("Category 2");

        when(categoryRepository.findByParentCategoryIsNull()).thenReturn(List.of(rootCategory1, rootCategory2));
        when(categoryRepository.findAll()).thenReturn(List.of(rootCategory1, rootCategory2));
        // Act
        final List<CategoryFullTreeResponse> result = categoryService.getAllCategories();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Category 1", result.get(0).getName());
        assertEquals("Category 2", result.get(1).getName());
        verify(categoryRepository, times(1)).findByParentCategoryIsNull();
    }

    @Test
    void getFullCategoryPath_ShouldReturnFullPath() {
        // Arrange
        final Category rootCategory = new Category();
        rootCategory.setId(1L);
        rootCategory.setName("Root Category");

        final Category childCategory = new Category();
        childCategory.setId(2L);
        childCategory.setName("Child Category");
        childCategory.setParentCategory(rootCategory);

        when(categoryRepository.findById(2L)).thenReturn(Optional.of(childCategory));

        // Act
        final List<CategoryWithoutChildren> path = categoryService.getFullCategoryPath(2L);

        // Assert
        assertNotNull(path);
        assertEquals(2, path.size());
        assertEquals("Root Category", path.get(0).getName());
        assertEquals("Child Category", path.get(1).getName());
    }

    @Test
    void getFullCategoryPath_ShouldReturnNull_WhenCategoryNotFound() {
        // Arrange
        when(categoryRepository.findById(3L)).thenReturn(Optional.empty());

        // Act
        final List<CategoryWithoutChildren> path = categoryService.getFullCategoryPath(3L);

        // Assert
        assertNull(path);
    }

    @Test
    void getCategoryById_ShouldReturnCategory_WhenCategoryExists() {
        // Arrange
        final Category mockCategory = new Category();
        mockCategory.setId(1L);
        mockCategory.setName("Test Category");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));

        // Act
        final Category result = categoryService.getCategoryById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Category", result.getName());
        verify(categoryRepository, times(1)).findById(1L);
    }

    @Test
    void getCategoryById_ShouldReturnNull_WhenCategoryNotFound() {
        // Arrange
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        final Category result = categoryService.getCategoryById(1L);

        // Assert
        assertNull(result);
        verify(categoryRepository, times(1)).findById(1L);
    }

    @Test
    void getDescendantCategoryIds_ShouldReturnSetOfIds_WhenCategoryExists() {
        // Arrange
        final Category rootCategory = new Category();
        rootCategory.setId(1L);
        rootCategory.setName("Root Category");

        final Category child1 = new Category();
        child1.setId(2L);
        child1.setName("Child 1");
        child1.setParentCategory(rootCategory);

        final Category child2 = new Category();
        child2.setId(3L);
        child2.setName("Child 2");
        child2.setParentCategory(rootCategory);

        rootCategory.setChildren(List.of(child1, child2));

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(rootCategory));

        // Act
        final Set<Long> result = categoryService.getDescendantCategoryIds(1L);

        // Assert
        assertNotNull(result);
        assertEquals(3, result.size());
        assertTrue(result.contains(1L));
        assertTrue(result.contains(2L));
        assertTrue(result.contains(3L));
        verify(categoryRepository, times(1)).findById(1L);
    }

    @Test
    void getDescendantCategoryIds_ShouldThrowException_WhenCategoryNotFound() {
        // Arrange
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        final EntityNotFoundException thrown = assertThrows(EntityNotFoundException.class, () -> categoryService.getDescendantCategoryIds(1L));
        assertEquals("Category not found", thrown.getMessage());
        verify(categoryRepository, times(1)).findById(1L);
    }

    @Test
    void flatListAllCategories_ShouldReturnFlatList() {
        // Arrange
        final Category category1 = new Category();
        category1.setId(1L);
        category1.setName("Category 1");

        final Category category2 = new Category();
        category2.setId(2L);
        category2.setName("Category 2");

        when(categoryRepository.findAll()).thenReturn(List.of(category1, category2));

        // Act
        final List<CategoryWithoutChildren> result = categoryService.flatListAllCategories();

        // Assert
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Category 1", result.get(0).getName());
        assertEquals("Category 2", result.get(1).getName());
        verify(categoryRepository, times(1)).findAll();
    }
}