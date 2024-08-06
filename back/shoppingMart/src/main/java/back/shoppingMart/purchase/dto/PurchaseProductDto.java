package back.shoppingMart.purchase.dto;

import back.shoppingMart.purchase.entity.PurchaseProduct;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PurchaseProductDto {
    private String productName;
    private Integer count;
    private Integer totalPrice;
    private Integer singlePrice;


    public PurchaseProductDto(String productName, Integer count, Integer totalPrice, Integer singlePrice) {
        this.productName = productName;
        this.count = count;
        this.totalPrice = totalPrice;
        this.singlePrice = singlePrice;
    }


}
