package back.shoppingMart.discount.dto;


import lombok.Data;


@Data
public class DiscountDto {

    private Long DiscountId;
    private String discountType;

    public DiscountDto(Long discountId, String discountType) {
        DiscountId = discountId;
        this.discountType = discountType;
    }

}
