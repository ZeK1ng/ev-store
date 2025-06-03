package ge.evstore.ev_store.service.impl;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.repository.CategoryRepository;
import ge.evstore.ev_store.service.interf.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> getAllCategories() {
        return List.of();
    }

    @Override
    public String getFullCategoryPath(final Long categoryId) {
        Category category = this.getCategoryById(categoryId);
        if (category == null) {
            return null;
        }
        final List<String> path = new ArrayList<>();
        while (category.getParentCategory() != null) {
            path.add(category.getName());
            category = this.getCategoryById(category.getParentCategory());
        }
        Collections.reverse(path);
        return String.join(" -> ", path);
    }

    @Override
    public Category getCategoryById(final Long id) {
        return categoryRepository.findById(id).orElse(null);
    }
}
