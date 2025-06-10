package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.repository.CategoryRepository;
import ge.evstore.ev_store.response.CategoryFullTreeResponse;
import ge.evstore.ev_store.response.CategoryWithoutChildren;
import ge.evstore.ev_store.service.interf.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public List<CategoryFullTreeResponse> getAllCategories() {
        log.info("Fetching all root categories (parentCategory IS NULL)");

        final List<Category> rootCategories = categoryRepository.findByParentCategoryIsNull();

        log.info("Found {} root categories", rootCategories.size());

        // Map each root category to DTO, including recursive children
        final List<CategoryFullTreeResponse> categoryTree = rootCategories.stream()
                .map(CategoryFullTreeResponse::fromEntity)
                .collect(Collectors.toList());

        log.info("Mapped categories to full tree DTOs");

        return categoryTree;
    }

    @Override
    public String getFullCategoryPath(final Long categoryId) {
        log.info("Retrieving full category path for categoryId: {}", categoryId);

        Category category = this.getCategoryById(categoryId);
        if (category == null) {
            log.warn("Category not found for id: {}", categoryId);
            return null;
        }

        final List<String> path = new ArrayList<>();
        while (category != null) {
            path.add(category.getName());
            category = category.getParentCategory();
        }

        Collections.reverse(path);
        final String fullPath = String.join("/", path);
        log.info("Full category path for id {} is '{}'", categoryId, fullPath);

        return fullPath;
    }

    @Override
    public Category getCategoryById(final Long id) {
        log.info("Retrieving category with id {}", id);
        return categoryRepository.findById(id).orElse(null);
    }

    /**
     * Recursively collects the IDs of the given category and all its descendants.
     */
    @Override
    public Set<Long> getDescendantCategoryIds(final Long categoryId) {
        log.info("Retrieving children category ids for parent id {}", categoryId);
        final Category rootCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        final Set<Long> result = new HashSet<>();
        collectCategoryIds(rootCategory, result);
        return result;
    }

    @Override
    public List<CategoryWithoutChildren> flatListAllCategories() {
        log.info("Retrieving flat list of all categories");
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
