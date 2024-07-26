package back.shoppingMart.purchase.entity;

import back.shoppingMart.user.entity.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Purchase {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "purchaseId")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId")
    private User user;

    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL)
    private List<PurchaseProduct> purchaseProducts = new ArrayList<>();

    private LocalDate purchaseDate;



    // 연관 관계 메서드
    public void setUser(User user) {
        this.user = user;
        user.getPurchases().add(this);
    }

    public void addPurchaseProduct(PurchaseProduct purchaseProduct) {
        purchaseProducts.add(purchaseProduct);
        purchaseProduct.setPurchase(this);
    }


}
