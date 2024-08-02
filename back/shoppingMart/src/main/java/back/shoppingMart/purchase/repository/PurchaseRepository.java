package back.shoppingMart.purchase.repository;

import back.shoppingMart.purchase.entity.Purchase;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByUserIdAndPurchaseDate(Long userId, LocalDate purchaseDate);
    List<Purchase> findByUserIdAndPurchaseDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    List<Purchase> findAllPurchasesByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Purchase p WHERE p.user.id = :userId ORDER BY p.purchaseDate DESC")
    List<Purchase> findRecentPurchasesByUserId(@Param("userId") Long userId, Pageable pageable);
}
