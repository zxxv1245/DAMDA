package back.shoppingMart.purchase.sevice;

import back.shoppingMart.common.exception.CustomException;
import back.shoppingMart.common.exception.ErrorType;
import back.shoppingMart.product.entity.Product;
import back.shoppingMart.product.repository.ProductRepository;
import back.shoppingMart.purchase.dto.*;
import back.shoppingMart.purchase.entity.Purchase;
import back.shoppingMart.purchase.entity.PurchaseProduct;
import back.shoppingMart.purchase.repository.PurchaseRepository;
import back.shoppingMart.user.entity.User;
import back.shoppingMart.user.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<PurchaseResponseDto> getPurchasesByUserAndDate(Long userId, LocalDate purchaseDate) {
        List<Purchase> purchases = purchaseRepository.findByUserIdAndPurchaseDate(userId, purchaseDate);

        return purchases.stream().map(purchase -> {
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
    public List<PurchaseResponseWithImageDto> getMostRecentPurchases(Long userId) {
        Pageable pageable = PageRequest.of(0, 1);
        List<Purchase> purchases = purchaseRepository.findRecentPurchasesByUserId(userId, pageable);
        return purchases.stream()
                .map(purchase -> {
                    List<PurchaseProductWithImageDto> purchaseProductDtos = purchase.getPurchaseProducts().stream()
                            .map(purchaseProduct -> new PurchaseProductWithImageDto(
                                    purchaseProduct.getProduct().getProductName(),
                                    purchaseProduct.getCount(),
                                    purchaseProduct.getTotalPrice(),
                                    purchaseProduct.getProduct().getProductImage()))
                            .collect(Collectors.toList());

                    double totalPrice = calculateTotalPrice(List.of(purchase));

                    return new PurchaseResponseWithImageDto(
                            purchase.getId(),
                            purchase.getPurchaseDate(),
                            purchaseProductDtos,
                            totalPrice
                    );
                }).collect(Collectors.toList());
    }

    @Transactional
    public Purchase savePurchase(Long userId, PurchaseRequestDto purchaseRequestDto) {
        User user = userRepository.findById(userId).orElseThrow(() -> new CustomException(ErrorType.NOT_FOUND_USER));
        Purchase purchase = new Purchase();
        purchase.setUser(user);
        purchase.setPurchaseDate(LocalDate.now());

        List<PurchaseProduct> purchaseProducts = purchaseRequestDto.getPurchaseProduct().stream().map(dto -> {
            PurchaseProduct purchaseProduct = new PurchaseProduct();
            Product product = productRepository.findByProductName(dto.getProductName());
            if (product == null) {
                throw new CustomException(ErrorType.NOT_FOUND_PRODUCT);
            }
            purchaseProduct.setPurchase(purchase);
            purchaseProduct.setProduct(product);
            purchaseProduct.setCount(dto.getCount());
            return purchaseProduct;
        }).toList();

        purchase.setPurchaseProducts(purchaseProducts);
        return purchaseRepository.save(purchase);

    }
}