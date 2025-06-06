package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.response.CategoryFullTreeResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryFullTreeResponse> getAllCategories();

    String getFullCategoryPath(Long categoryId);

    Category getCategoryById(Long id);
}
