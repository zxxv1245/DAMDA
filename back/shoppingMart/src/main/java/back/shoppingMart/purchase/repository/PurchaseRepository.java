package back.shoppingMart.purchase.repository;

import back.shoppingMart.purchase.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByUserIdAndPurchaseDate(Long userId, LocalDate purchaseDate);
    List<Purchase> findByUserIdAndPurchaseDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

}
