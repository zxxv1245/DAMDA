package back.shoppingMart.product;
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
    private Float productPrice;
    private String productLocation;
    private Boolean productAdult;
    private String productDescription;
    private String productImage;

    @ManyToOne(fetch = LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "discount")
    private Discount discount;

}
