package back.shoppingMart.discount.dto;


import back.shoppingMart.discount.entity.DiscountType;
import lombok.Data;


@Data
public class DiscountDto {

    private Long DiscountId;
    private String discountType;

    public DiscountDto(Long discountId, DiscountType discountType) {
        DiscountId = discountId;
        this.discountType = discountType.getDiscountValue();
    }

}
