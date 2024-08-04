package back.shoppingMart.purchase.dto;

import lombok.Data;

@Data
public class PurchaseProductWithImageDto {
    private String productName;
    private int count;
    private double totalPrice;
    private String productImage;

    public PurchaseProductWithImageDto(String productName, int count, double totalPrice) {
        this.productName = productName;
        this.count = count;
        this.totalPrice = totalPrice;
    }

    public PurchaseProductWithImageDto(String productName, int count, double totalPrice, String productImage) {
        this.productName = productName;
        this.count = count;
        this.totalPrice = totalPrice;
        this.productImage = productImage;
    }



}
