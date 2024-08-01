package back.shoppingMart.discount.entity;

import back.shoppingMart.product.Product;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@Entity
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="discountId")
    private Long id;

    @OneToMany(mappedBy = "discount")
    private List<Product> products = new ArrayList<>();

    private DiscountType discountType;
}
