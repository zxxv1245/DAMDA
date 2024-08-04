package back.shoppingMart.product.repository;

import back.shoppingMart.product.entity.Product;
import back.shoppingMart.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    public Product findByProductName(String productName);
}
