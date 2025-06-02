package ge.evstore.ev_store.entity;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.Data;
import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;

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
    private Integer categoryId;

    private String imageName;
    private String imageFilePath;
//    private byte[] image; //

    public void update(final Product product) {
        final ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setPropertyCondition(Conditions.isNotNull());
        modelMapper.map(product, this);
    }
}
