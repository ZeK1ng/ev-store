package ge.evstore.ev_store.entity;


import ge.evstore.ev_store.request.ProductRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;

import java.util.List;

@Entity
@Data
@Table(name = "products")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Product {
    @Schema(hidden = true)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nameGE;
    private String nameENG;
    private String nameRUS;

    @Column(length = 1000)
    private String descriptionGE;
    @Column(length = 1000)
    private String descriptionENG;
    @Column(length = 1000)
    private String descriptionRUS;

    private Double price;

    private Integer stockAmount;

    private String tutorialLink;

    @ManyToOne
    private Category category;

    private Long mainImageId;

    private String itemCode;

    private String imageIds;

    private Boolean isPopular;
    
    public void update(final Product product) {
        final ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.map(product, this);
    }

    public static Product fromProductRequest(final ProductRequest productRequest) {
        return Product.builder().nameGE(productRequest.getNameGE())
                .nameENG(productRequest.getNameENG())
                .nameRUS(productRequest.getNameRUS())
                .descriptionENG(productRequest.getDescriptionENG())
                .descriptionGE(productRequest.getDescriptionGE())
                .descriptionRUS(productRequest.getDescriptionRUS())
                .price(productRequest.getPrice())
                .stockAmount(productRequest.getStockAmount())
                .isPopular(productRequest.getIsPopular())
                .tutorialLink(productRequest.getTutorialLink())
                .mainImageId(productRequest.getMainImageId())
                .itemCode(productRequest.getItemCode())
                .build();
    }
}
