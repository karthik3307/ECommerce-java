package com.shop.backend.controller;

import com.shop.backend.model.*;
import com.shop.backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepo;
    private final CartItemRepository cartRepo;
    private final ProductRepository productRepo;

    public OrderController(OrderRepository orderRepo, CartItemRepository cartRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
    }

    // body: { "userId": 1, "address": "..." }
    @PostMapping
    @Transactional
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, String> body) {
        Long userId = Long.valueOf(body.get("userId"));
        String address = body.get("address");
        if (address == null || address.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Address is required"));
        }

        List<CartItem> cartItems = cartRepo.findByUserId(userId);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cart is empty"));
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setAddress(address);
        double total = 0;

        for (CartItem ci : cartItems) {
            Product p = ci.getProduct();
            if (ci.getQuantity() > p.getStock()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Not enough stock for " + p.getName()));
            }
            p.setStock(p.getStock() - ci.getQuantity());
            productRepo.save(p);

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProductName(p.getName());
            oi.setPrice(p.getPrice());
            oi.setQuantity(ci.getQuantity());
            order.getItems().add(oi);
            total += p.getPrice() * ci.getQuantity();
        }
        order.setTotal(total);
        Order saved = orderRepo.save(order);
        cartRepo.deleteByUserId(userId);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{userId}")
    public List<Order> myOrders(@PathVariable Long userId) {
        return orderRepo.findByUserIdOrderByIdDesc(userId);
    }

    // admin: all orders
    @GetMapping
    public List<Order> allOrders() {
        return orderRepo.findAll();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return orderRepo.findById(id).map(o -> {
            o.setStatus(body.get("status"));
            return ResponseEntity.ok(orderRepo.save(o));
        }).orElse(ResponseEntity.notFound().build());
    }
}
