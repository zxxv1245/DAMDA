package back.shoppingMart.purchase.dto;

import lombok.Data;

import java.util.List;

@Data
public class PurchaseRequestDto {


    private List<PurchaseProductDto> purchaseProduct;
    private Integer totalPrice;
}
