package ge.evstore.ev_store.response;

import ge.evstore.ev_store.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Long productId;
    private String nameGE;
    private String nameENG;
    private String nameRUS;

    private String descriptionGE;
    private String descriptionENG;
    private String descriptionRUS;

    private Double price;

    private String itemCode;

    private Integer stockAmount;

    private String categoryName;
    private Long categoryId;

    private Long mainImageId;

    private List<Long> imageIds;

    private Boolean isPopular;

    private String tutorialLink;
    private Boolean comingSoon;

    public static ProductResponse from(final Product product, final List<Long> imageIds) {
        return ProductResponse.builder()
                .productId(product.getId())
                .nameGE(product.getNameGE())
                .nameENG(product.getNameENG())
                .nameRUS(product.getNameRUS())
                .descriptionGE(product.getDescriptionGE())
                .descriptionENG(product.getDescriptionENG())
                .descriptionRUS(product.getDescriptionRUS())
                .price(product.getPrice())
                .stockAmount(product.getStockAmount())
                .categoryName(product.getCategory().getName())
                .categoryId(product.getCategory().getId())
                .mainImageId(product.getMainImageId())
                .isPopular(product.getIsPopular())
                .tutorialLink(product.getTutorialLink())
                .imageIds(imageIds)
                .itemCode(product.getItemCode())
                .comingSoon(product.getComingSoon())
                .build();
    }
}
