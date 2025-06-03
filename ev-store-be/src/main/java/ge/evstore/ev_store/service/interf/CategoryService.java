package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.Category;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories();

    String getFullCategoryPath(Long categoryId);

    Category getCategoryById(Long id);
}
