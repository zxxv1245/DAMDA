package back.shoppingMart.purchase.dto;

import back.shoppingMart.purchase.entity.PurchaseProduct;
import lombok.Data;

@Data
public class PurchaseProductDto {
    private String productName;
    private int count;
    private double totalPrice;


    public PurchaseProductDto(String productName, int count, double totalPrice) {
        this.productName = productName;
        this.count = count;
        this.totalPrice = totalPrice;
    }


}
