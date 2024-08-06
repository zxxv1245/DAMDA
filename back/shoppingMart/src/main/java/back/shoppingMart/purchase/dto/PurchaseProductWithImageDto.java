package back.shoppingMart.purchase.dto;

import lombok.Data;

@Data
public class PurchaseProductWithImageDto {
    private String productName;
    private Integer count;
    private Integer totalPrice;
    private String productImage;

    public PurchaseProductWithImageDto(String productName, Integer count, Integer totalPrice) {
        this.productName = productName;
        this.count = count;
        this.totalPrice = totalPrice;
    }

    public PurchaseProductWithImageDto(String productName, Integer count, Integer totalPrice, String productImage) {
        this.productName = productName;
        this.count = count;
        this.totalPrice = totalPrice;
        this.productImage = productImage;
    }



}
