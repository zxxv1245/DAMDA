package back.shoppingMart.purchase.dto;

import lombok.Data;

@Data
public class PurchaseProductDto {
    private String product_name;
    private int count;
    private double totalPrice;

    public PurchaseProductDto(String product_name, int count, double totalPrice) {
        this.product_name = product_name;
        this.count = count;
        this.totalPrice = totalPrice;
    }
}
