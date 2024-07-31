package back.shoppingMart.purchase.dto;

import lombok.Data;

import java.time.LocalDate;

import java.util.List;

@Data
public class PurchaseResponseDto {
    private Long purchaseId;
    private LocalDate purchaseDate;
    private List<PurchaseProductDto> purchaseProducts;
    private double totalPrice;

    public PurchaseResponseDto(Long purchaseId, LocalDate purchaseDate, List<PurchaseProductDto> purchaseProducts, double totalPrice) {
        this.purchaseId = purchaseId;
        this.purchaseDate = purchaseDate;
        this.purchaseProducts = purchaseProducts;
        this.totalPrice = totalPrice;
    }
}
