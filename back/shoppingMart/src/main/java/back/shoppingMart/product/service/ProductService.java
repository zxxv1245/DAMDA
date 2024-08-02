package back.shoppingMart.product.service;


import back.shoppingMart.product.entity.ProductDto;
import back.shoppingMart.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(product -> new ProductDto(
                        product.getId(),
                        product.getSerialNumber(),
                        product.getProductName(),
                        product.getProductPrice(),
                        product.getProductLocation(),
                        product.getProductAdult(),
                        product.getProductDescription(),
                        product.getProductImage(),
                        product.getDetectName(),
                        product.getProductBarcode()
                ))
                .collect(Collectors.toList());
    }

}
