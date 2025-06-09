package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.repository.CategoryRepository;
import ge.evstore.ev_store.response.CategoryFullTreeResponse;
import ge.evstore.ev_store.response.CategoryWithoutChildren;
import ge.evstore.ev_store.service.interf.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public List<CategoryFullTreeResponse> getAllCategories() {
        // 1. Load all categories where parentCategory IS NULL
        final List<Category> rootCategories = categoryRepository.findByParentCategoryIsNull();

        // 2. Map each root → DTO (this recurses through children)
        return rootCategories.stream()
                .map(CategoryFullTreeResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public String getFullCategoryPath(final Long categoryId) {
        Category category = this.getCategoryById(categoryId);
        if (category == null) {
            return null;
        }
        final List<String> path = new ArrayList<>();
        while (category != null) {
            path.add(category.getName());
            category = category.getParentCategory();
        }
        Collections.reverse(path);
        return String.join("/", path);
    }

    @Override
    public Category getCategoryById(final Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    /**
     * Recursively collects the IDs of the given category and all its descendants.
     */
    @Override
    public Set<Long> getDescendantCategoryIds(final Long categoryId) {
        final Category rootCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        final Set<Long> result = new HashSet<>();
        collectCategoryIds(rootCategory, result);
        return result;
    }

    @Override
    public List<CategoryWithoutChildren> flatListAllCategories() {
        final List<CategoryWithoutChildren> response = new ArrayList<>();
        final List<Category> categoryList = categoryRepository.findAll();
        for (final Category category : categoryList) {
            response.add(CategoryWithoutChildren.builder().name(category.getName())
                    .description(category.getDescription())
                    .id(category.getId()).parentCategoryName(category.getParentCategory() == null ? null : category.getParentCategory().getName()).build());
        }
        return response;
    }

    private void collectCategoryIds(final Category category, final Set<Long> result) {
        result.add(category.getId());
        for (final Category child : category.getChildren()) {
            collectCategoryIds(child, result);
        }
    }
}
