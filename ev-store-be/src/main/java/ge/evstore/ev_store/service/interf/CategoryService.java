package ge.evstore.ev_store.service.interf;

import ge.evstore.ev_store.entity.Category;
import ge.evstore.ev_store.response.CategoryFullTreeResponse;
import ge.evstore.ev_store.response.CategoryWithoutChildren;

import java.util.List;
import java.util.Set;

public interface CategoryService {
    List<CategoryFullTreeResponse> getAllCategories();

    String getFullCategoryPath(Long categoryId);

    Category getCategoryById(Long id);

    Set<Long> getDescendantCategoryIds(final Long categoryId);

    List<CategoryWithoutChildren> flatListAllCategories();
}
