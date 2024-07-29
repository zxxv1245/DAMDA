package back.shoppingMart.purchase.dto;

import lombok.Data;

import java.time.LocalDate;

import java.util.List;

@Data
public class PurchaseResponseDto {
    private Long purchase_id;
    private LocalDate purchaseDate;
    private List<PurchaseProductDto> purchaseProducts;
    private double totalPrice;

    public PurchaseResponseDto(Long purchase_id, LocalDate purchaseDate, List<PurchaseProductDto> purchaseProducts, double totalPrice) {
        this.purchase_id = purchase_id;
        this.purchaseDate = purchaseDate;
        this.purchaseProducts = purchaseProducts;
        this.totalPrice = totalPrice;
    }
}
