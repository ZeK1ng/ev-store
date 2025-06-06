package ge.evstore.ev_store.entity;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;

import java.util.ArrayList;
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

    @OneToOne(cascade = CascadeType.ALL)
    private ImageEntity mainImage;
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "product_id")
    private List<ImageEntity> otherImages = new ArrayList<>();

    private Boolean isPopular;
//    private byte[] image; //

    public void update(final Product product) {
        final ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.map(product, this);
    }
}
