package back.shoppingMart.discount.controller;

import back.shoppingMart.common.response.MsgType;
import back.shoppingMart.common.response.ResponseEntityDto;
import back.shoppingMart.common.response.ResponseUtils;
import back.shoppingMart.discount.dto.DiscountDto;
import back.shoppingMart.discount.service.DiscountService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class DiscountController {

    private final DiscountService discountService;

    @GetMapping("/getDiscount")
    public ResponseEntityDto<List<DiscountDto>> getNewDiscounts() {
        List<DiscountDto> discounts = discountService.getAllDiscounts();
        return ResponseUtils.ok(discounts, MsgType.SEARCH_SUCCESSFULLY);
    }
}
