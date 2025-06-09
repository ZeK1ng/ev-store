package ge.evstore.ev_store.request;

import lombok.Data;

import java.util.List;

@Data
public class ProductRequest {
    private String nameGE;
    private String nameENG;
    private String nameRUS;

    private String descriptionGE;
    private String descriptionENG;
    private String descriptionRUS;

    private Double price;

    private Integer stockAmount;

    private Long categoryId;
    private Long mainImageId;
    private List<Long> imageIds;
    private Boolean isPopular;
    private String tutorialLink;
}
