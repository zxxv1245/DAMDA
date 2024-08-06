package back.shoppingMart.product.entity;
import back.shoppingMart.discount.entity.Discount;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import lombok.Data;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productId")
    private Long id;

    private String serialNumber;
    private String productName;
    private Integer productPrice;
    private String productLocation;
    private Boolean productAdult;
    private String productDescription;
    private String productImage;
    private String detectName;
    private Integer productBarcode;

    @ManyToOne(fetch = LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "discount")
    private Discount discount;

}
