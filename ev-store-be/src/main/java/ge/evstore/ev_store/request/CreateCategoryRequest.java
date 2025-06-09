package ge.evstore.ev_store.request;

import lombok.Data;

@Data
public class CreateCategoryRequest {
    private String name;
    private String description;
    private Long parentCategoryId;
}
