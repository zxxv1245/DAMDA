package back.shoppingMart.purchase.dto;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class PurchaseResponseWithImageDto {
    private Long purchaseId;
    private LocalDate purchaseDate;
    private List<PurchaseProductWithImageDto> purchaseProducts;
    private Integer totalPrice;

    public PurchaseResponseWithImageDto(Long purchaseId, LocalDate purchaseDate, List<PurchaseProductWithImageDto> purchaseProducts, Integer totalPrice) {
        this.purchaseId = purchaseId;
        this.purchaseDate = purchaseDate;
        this.purchaseProducts = purchaseProducts;
        this.totalPrice = totalPrice;
    }

}

