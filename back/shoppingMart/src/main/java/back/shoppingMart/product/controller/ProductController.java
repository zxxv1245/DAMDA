package back.shoppingMart.product.controller;

import back.shoppingMart.common.response.MsgType;
import back.shoppingMart.common.response.ResponseEntityDto;
import back.shoppingMart.common.response.ResponseUtils;
import back.shoppingMart.product.entity.ProductDto;
import back.shoppingMart.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ProductController {

    private final ProductService productService;

    @GetMapping("/getProduct")
    public ResponseEntityDto<List<ProductDto>> getNewProducts() {
        List<ProductDto> products = productService.getAllProducts();
        return ResponseUtils.ok(products, MsgType.SEARCH_SUCCESSFULLY);
    }
}
