package com.shop.backend.controller;

import com.shop.backend.model.CartItem;
import com.shop.backend.model.Product;
import com.shop.backend.repository.CartItemRepository;
import com.shop.backend.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartItemRepository cartRepo;
    private final ProductRepository productRepo;

    public CartController(CartItemRepository cartRepo, ProductRepository productRepo) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
    }

    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId) {
        return cartRepo.findByUserId(userId);
    }

    // body: { "userId": 1, "productId": 2, "quantity": 1 }
    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        Long productId = body.get("productId");
        int qty = body.getOrDefault("quantity", 1L).intValue();

        Product product = productRepo.findById(productId).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Product not found"));
        }

        CartItem item = cartRepo.findByUserIdAndProductId(userId, productId).orElse(null);
        if (item == null) {
            item = new CartItem();
            item.setUserId(userId);
            item.setProduct(product);
            item.setQuantity(0);
        }
        int newQty = item.getQuantity() + qty;
        if (newQty > product.getStock()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Only " + product.getStock() + " in stock"));
        }
        item.setQuantity(newQty);
        return ResponseEntity.ok(cartRepo.save(item));
    }

    @DeleteMapping("/item/{id}")
    public void removeItem(@PathVariable Long id) {
        cartRepo.deleteById(id);
    }
}
