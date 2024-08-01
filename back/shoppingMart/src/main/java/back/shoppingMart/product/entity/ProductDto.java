package back.shoppingMart.product.entity;

import lombok.Data;

@Data
public class ProductDto {
    private Long id;
    private String serialNumber;
    private String productName;
    private Float productPrice;
    private String productLocation;
    private Boolean productAdult;
    private String productDescription;
    private String productImage;

    // 기본 생성자
    public ProductDto() {
    }

    // 모든 필드를 포함하는 생성자
    public ProductDto(Long id, String serialNumber, String productName, Float productPrice, String productLocation, Boolean productAdult, String productDescription, String productImage) {
        this.id = id;
        this.serialNumber = serialNumber;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productLocation = productLocation;
        this.productAdult = productAdult;
        this.productDescription = productDescription;
        this.productImage = productImage;
    }

}
