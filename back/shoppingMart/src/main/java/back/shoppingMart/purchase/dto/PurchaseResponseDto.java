package back.shoppingMart.purchase.dto;

import back.shoppingMart.purchase.entity.Purchase;
import lombok.Data;

import java.time.LocalDate;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class PurchaseResponseDto {
    private Long purchaseId;
    private LocalDate purchaseDate;
    private List<PurchaseProductDto> purchaseProducts;
    private Integer totalPrice;

    public PurchaseResponseDto(Long purchaseId, LocalDate purchaseDate, List<PurchaseProductDto> purchaseProducts, Integer totalPrice) {
        this.purchaseId = purchaseId;
        this.purchaseDate = purchaseDate;
        this.purchaseProducts = purchaseProducts;
        this.totalPrice = totalPrice;
    }

}

