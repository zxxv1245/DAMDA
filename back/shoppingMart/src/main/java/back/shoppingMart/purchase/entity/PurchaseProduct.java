package back.shoppingMart.purchase.entity;

import back.shoppingMart.discount.entity.DiscountType;
import back.shoppingMart.product.entity.Product;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.persistence.Id;

import lombok.Data;



import static jakarta.persistence.FetchType.LAZY;

@Entity
@Data
public class PurchaseProduct {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchaseProductId")
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "productId")
    private Product product;

    @JsonIgnore
    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "purchaseId")
    private Purchase purchase;


    private Integer count;

    private Integer singlePrice;

    public Integer getTotalPrice() {
        double totalPrice = 0;
        Integer price = product.getProductPrice();
        DiscountType discount = product.getDiscount().getDiscountType();

        switch (discount) {
            case TEN:
                totalPrice = count * price * 0.9;
                break;
            case THIRTY:
                totalPrice = count * price * 0.7;
                break;
            case HALF:
                totalPrice = count * price * 0.5;
                break;
            case NONE:
            default:
                totalPrice = count * price;
                break;
        }

        int result = (int) totalPrice;
        return result;
    }

    public Integer calculateSinglePrice() {
        double singlePrice = 0;
        Integer price = product.getProductPrice();
        DiscountType discount = product.getDiscount().getDiscountType();

        switch (discount) {
            case TEN:
                singlePrice = price * 0.9;
                break;
            case THIRTY:
                singlePrice = price * 0.7;
                break;
            case HALF:
                singlePrice = price * 0.5;
                break;
            case NONE:
            default:
                singlePrice = price;
                break;
        }
        int result = (int) singlePrice;
        return result;
    }


}
