package back.shoppingMart.purchase.sevice;

import back.shoppingMart.purchase.dto.PurchaseProductDto;
import back.shoppingMart.purchase.dto.PurchaseResponseDto;
import back.shoppingMart.purchase.entity.Purchase;
import back.shoppingMart.purchase.entity.PurchaseProduct;
import back.shoppingMart.purchase.repository.PurchaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseService {


    private final PurchaseRepository purchaseRepository;

    public List<Purchase> getPurchasesByUserAndDate(Long userId, LocalDate purchaseDate) {
        return purchaseRepository.findByUserIdAndPurchaseDate(userId, purchaseDate);
    }

    public double calculateTotalPrice(List<Purchase> purchases) {
        return purchases.stream()
                .flatMap(purchase -> purchase.getPurchaseProducts().stream())
                .mapToDouble(PurchaseProduct::getTotalPrice)
                .sum();
    }

    // 해당 월 총 사용 금액 로직
    public double getTotalPriceByUserAndMonth(Long userId, int year, int month) {
        LocalDate startDate = YearMonth.of(year, month).atDay(1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        List<Purchase> purchases = purchaseRepository.findByUserIdAndPurchaseDateBetween(userId, startDate, endDate);
        return calculateTotalPrice(purchases);
    }

    // 해당 월의 결제한 날들을 조회하는 로직
    public List<LocalDate> getPurchaseDatesByUserAndMonth(Long userId, int year, int month) {
        LocalDate startDate = YearMonth.of(year, month).atDay(1);
        LocalDate endDate = startDate.plusMonths(1).minusDays(1);

        List<Purchase> purchases = purchaseRepository.findByUserIdAndPurchaseDateBetween(userId, startDate, endDate);
        return purchases.stream()
                .map(Purchase::getPurchaseDate)
                .distinct()
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PurchaseResponseDto> getAllPurchases(Long userId) {
        Pageable pageable = PageRequest.of(0, 1);
        List<Purchase> purchases = purchaseRepository.findAllPurchasesByUserId(userId);
        return purchases.stream()
                .map(purchase -> {
                    List<PurchaseProductDto> purchaseProductDtos = purchase.getPurchaseProducts().stream()
                            .map(purchaseProduct -> new PurchaseProductDto(
                                    purchaseProduct.getProduct().getProductName(),
                                    purchaseProduct.getCount(),
                                    purchaseProduct.getTotalPrice()))
                            .collect(Collectors.toList());

                    double totalPrice = calculateTotalPrice(List.of(purchase));

                    return new PurchaseResponseDto(
                            purchase.getId(),
                            purchase.getPurchaseDate(),
                            purchaseProductDtos,
                            totalPrice
                    );
                }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PurchaseResponseDto> getMostRecentPurchases(Long userId) {
        Pageable pageable = PageRequest.of(0, 1);
        List<Purchase> purchases = purchaseRepository.findRecentPurchasesByUserId(userId, pageable);
        return purchases.stream()
                .map(purchase -> {
                    List<PurchaseProductDto> purchaseProductDtos = purchase.getPurchaseProducts().stream()
                            .map(purchaseProduct -> new PurchaseProductDto(
                                    purchaseProduct.getProduct().getProductName(),
                                    purchaseProduct.getCount(),
                                    purchaseProduct.getTotalPrice(),
                                    purchaseProduct.getProduct().getProductImage()))
                            .collect(Collectors.toList());

                    double totalPrice = calculateTotalPrice(List.of(purchase));

                    return new PurchaseResponseDto(
                            purchase.getId(),
                            purchase.getPurchaseDate(),
                            purchaseProductDtos,
                            totalPrice
                    );
                }).collect(Collectors.toList());
    }
}