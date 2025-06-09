package ge.evstore.ev_store.response;

import ge.evstore.ev_store.entity.Category;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class CategoryFullTreeResponse {

    private Long id;
    private String name;                // use “value” for category name
    private String description;
    private List<CategoryFullTreeResponse> children;

    /**
     * Recursively convert a Category entity (and its children) into CategoryResponse.
     */
    public static CategoryFullTreeResponse fromEntity(final Category category) {
        final CategoryFullTreeResponse resp = new CategoryFullTreeResponse();
        resp.setId(category.getId());
        resp.setName(category.getName());
        resp.setDescription(category.getDescription());
        // Map each child Category → CategoryResponse (recursive)
        if (category.getChildren() != null && !category.getChildren().isEmpty()) {
            final List<CategoryFullTreeResponse> childDtos = category.getChildren().stream()
                    .map(CategoryFullTreeResponse::fromEntity)
                    .collect(Collectors.toList());
            resp.setChildren(childDtos);
        } else {
            resp.setChildren(List.of());
        }

        return resp;
    }
}
