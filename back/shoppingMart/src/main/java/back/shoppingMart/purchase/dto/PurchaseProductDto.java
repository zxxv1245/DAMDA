package back.shoppingMart.purchase.dto;

import back.shoppingMart.purchase.entity.PurchaseProduct;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PurchaseProductDto {
    private String productName;
    private int count;
    private double totalPrice;
    private double singlePrice;


    public PurchaseProductDto(String productName, int count, double totalPrice, double singlePrice) {
        this.productName = productName;
        this.count = count;
        this.totalPrice = totalPrice;
        this.singlePrice = singlePrice;
    }


}
