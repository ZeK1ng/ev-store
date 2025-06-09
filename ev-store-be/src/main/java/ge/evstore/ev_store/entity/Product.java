package ge.evstore.ev_store.entity;


import ge.evstore.ev_store.utils.JsonListConverter;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;

import java.util.List;

@Entity
@Data
@Table(name = "products")
public class Product {
    @Schema(hidden = true)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nameGE;
    private String nameENG;
    private String nameRUS;

    private String descriptionGE;
    private String descriptionENG;
    private String descriptionRUS;

    private Double price;

    private Integer stockAmount;

    @ManyToOne
    private Category category;

    private Long mainImageId;

    @Column(columnDefinition = "jsonb")
    @Convert(converter = JsonListConverter.class)
    private List<Long> imageIds;

    private Boolean isPopular;
    
    public void update(final Product product) {
        final ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.map(product, this);
    }
}
