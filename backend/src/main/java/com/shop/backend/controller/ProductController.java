package com.shop.backend.controller;

import com.shop.backend.model.Product;
import com.shop.backend.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepo;

    public ProductController(ProductRepository productRepo) {
        this.productRepo = productRepo;
    }

    @GetMapping
    public List<Product> getAll(@RequestParam(required = false) String search) {
        if (search != null && !search.isBlank()) {
            return productRepo.findByNameContainingIgnoreCase(search);
        }
        return productRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getOne(@PathVariable Long id) {
        return productRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product add(@RequestBody Product product) {
        product.setId(null);
        return productRepo.save(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product p) {
        return productRepo.findById(id).map(existing -> {
            existing.setName(p.getName());
            existing.setDescription(p.getDescription());
            existing.setPrice(p.getPrice());
            existing.setStock(p.getStock());
            existing.setCategory(p.getCategory());
            existing.setImageUrl(p.getImageUrl());
            return ResponseEntity.ok(productRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!productRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
