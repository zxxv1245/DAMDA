package back.shoppingMart.purchase.controller;

import back.shoppingMart.common.auth.PrincipalDetails;
import back.shoppingMart.common.response.MsgType;
import back.shoppingMart.common.response.ResponseEntityDto;
import back.shoppingMart.common.response.ResponseUtils;
import back.shoppingMart.purchase.dto.PurchaseProductDto;
import back.shoppingMart.purchase.dto.PurchaseResponseDto;
import back.shoppingMart.purchase.entity.Purchase;
import back.shoppingMart.purchase.sevice.PurchaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PurchaseController {

    private final PurchaseService purchaseService;



    // 해당 날짜 구매 조회
    @GetMapping("/myPurchase/{purchase_date}")
    public ResponseEntityDto<List<PurchaseResponseDto>> getPurchasesByDate(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                                                           @PathVariable("purchase_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate purchaseDate) {

        List<Purchase> purchases = purchaseService.getPurchasesByUserAndDate(principalDetails.getUser().getId(), purchaseDate);

        List<PurchaseResponseDto> responseDtos = purchases.stream().map(purchase -> {
            List<PurchaseProductDto> purchaseProductDtos = purchase.getPurchaseProducts().stream()
                    .map(purchaseProduct -> new PurchaseProductDto(
                            purchaseProduct.getProduct().getProductName(),
                            purchaseProduct.getCount(),
                            purchaseProduct.getTotalPrice()))
                    .collect(Collectors.toList());

            double totalPrice = purchaseService.calculateTotalPrice(List.of(purchase));

            return new PurchaseResponseDto(
                    purchase.getId(),
                    purchase.getPurchaseDate(),
                    purchaseProductDtos,
                    totalPrice
            );
        }).collect(Collectors.toList());

        return ResponseUtils.ok(responseDtos, MsgType.SEARCH_SUCCESSFULLY);
    }

    // 해당 월 사용한 총 금액 조회
    @GetMapping("/myPurchase/{purchase_year}/{purchase_month}")
    public ResponseEntityDto<Double> getTotalPriceByMonth(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                       @PathVariable("purchase_year") int year,
                                       @PathVariable("purchase_month") int month) {
        double totalPrice = purchaseService.getTotalPriceByUserAndMonth(principalDetails.getUser().getId(), year, month);

        return ResponseUtils.ok(totalPrice, MsgType.SEARCH_SUCCESSFULLY);
    }

    // 해당 월 결제한 일자 조회
    @GetMapping("/myPurchase/{purchase_year}/{purchase_month}/dates")
    public ResponseEntityDto<List<LocalDate>> getPurchaseDatesByMonth(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                                   @PathVariable("purchase_year") int year,
                                                   @PathVariable("purchase_month") int month) {
        List<LocalDate> purchaseDates = purchaseService.getPurchaseDatesByUserAndMonth(principalDetails.getUser().getId(), year, month);

        return ResponseUtils.ok(purchaseDates, MsgType.SEARCH_SUCCESSFULLY);
    }

}