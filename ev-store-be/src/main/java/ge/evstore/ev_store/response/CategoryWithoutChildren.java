package ge.evstore.ev_store.response;

import ge.evstore.ev_store.entity.Category;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryWithoutChildren {
    private Long id;

    private String name;

    private String description;

    private String parentCategoryName;
}
