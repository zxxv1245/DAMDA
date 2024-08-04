package back.shoppingMart.purchase.controller;

import back.shoppingMart.common.auth.PrincipalDetails;
import back.shoppingMart.common.response.MsgType;
import back.shoppingMart.common.response.ResponseEntityDto;
import back.shoppingMart.common.response.ResponseUtils;
import back.shoppingMart.purchase.dto.PurchaseProductDto;
import back.shoppingMart.purchase.dto.PurchaseRequestDto;
import back.shoppingMart.purchase.dto.PurchaseResponseDto;
import back.shoppingMart.purchase.dto.PurchaseResponseWithImageDto;
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
@RequestMapping("/api/v1/myPurchase")
public class PurchaseController {

    private final PurchaseService purchaseService;



    // 해당 날짜 구매 조회
    @GetMapping("/{purchase_date}")
    public ResponseEntityDto<List<PurchaseResponseDto>> getPurchasesByDate(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                                                           @PathVariable("purchase_date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate purchaseDate) {
        List<PurchaseResponseDto> responseDtos = purchaseService.getPurchasesByUserAndDate(principalDetails.getUser().getId(), purchaseDate);
        return ResponseUtils.ok(responseDtos, MsgType.SEARCH_SUCCESSFULLY);
    }

    // 해당 월 사용한 총 금액 조회
    @GetMapping("/{purchase_year}/{purchase_month}")
    public ResponseEntityDto<Double> getTotalPriceByMonth(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                       @PathVariable("purchase_year") int year,
                                       @PathVariable("purchase_month") int month) {
        double totalPrice = purchaseService.getTotalPriceByUserAndMonth(principalDetails.getUser().getId(), year, month);

        return ResponseUtils.ok(totalPrice, MsgType.SEARCH_SUCCESSFULLY);
    }

    // 해당 월 결제한 일자 조회
    @GetMapping("/{purchase_year}/{purchase_month}/dates")
    public ResponseEntityDto<List<LocalDate>> getPurchaseDatesByMonth(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                                   @PathVariable("purchase_year") int year,
                                                   @PathVariable("purchase_month") int month) {
        List<LocalDate> purchaseDates = purchaseService.getPurchaseDatesByUserAndMonth(principalDetails.getUser().getId(), year, month);

        return ResponseUtils.ok(purchaseDates, MsgType.SEARCH_SUCCESSFULLY);
    }

    @GetMapping("/allPurchases")
    public ResponseEntityDto<List<PurchaseResponseDto>> getAllPurchase(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        List<PurchaseResponseDto> recentPurchase = purchaseService.getAllPurchases(principalDetails.getUser().getId());
        return ResponseUtils.ok(recentPurchase, MsgType.SEARCH_SUCCESSFULLY);
    }

    @GetMapping("/recent")
    public ResponseEntityDto<List<PurchaseResponseWithImageDto>> getRecentPurchase(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        List<PurchaseResponseWithImageDto> recentPurchase = purchaseService.getMostRecentPurchases(principalDetails.getUser().getId());
        return ResponseUtils.ok(recentPurchase, MsgType.SEARCH_SUCCESSFULLY);
    }

    @PostMapping("/savePurchase")
    public ResponseEntityDto<PurchaseRequestDto> savePurchase(@AuthenticationPrincipal PrincipalDetails principalDetails,
                                                               @RequestBody PurchaseRequestDto purchaseRequestDto) {
        purchaseService.savePurchase(principalDetails.getUser().getId(), purchaseRequestDto);
        return ResponseUtils.ok(purchaseRequestDto, MsgType.PURCHASE_SAVED);
    }

}