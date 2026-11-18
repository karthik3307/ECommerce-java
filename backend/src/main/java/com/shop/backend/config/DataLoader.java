package com.shop.backend.config;

import com.shop.backend.model.Product;
import com.shop.backend.model.User;
import com.shop.backend.repository.ProductRepository;
import com.shop.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// Adds sample data the first time the app starts
@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    public DataLoader(UserRepository userRepo, ProductRepository productRepo) {
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    @Override
    public void run(String... args) {
        if (userRepo.count() == 0) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@shop.com");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            userRepo.save(admin);
        }
        if (productRepo.count() == 0) {
            productRepo.save(new Product("Wireless Mouse", "Comfortable wireless mouse with USB receiver.", 499, 25, "Electronics", "/images/mouse.jpg"));
            productRepo.save(new Product("Bluetooth Headphones", "Over-ear headphones with deep bass.", 1999, 15, "Electronics", "/images/headphones.jpg"));
            productRepo.save(new Product("Running Shoes", "Lightweight shoes for daily running.", 2499, 20, "Fashion", "/images/shoes.jpg"));
            productRepo.save(new Product("Backpack", "Water-resistant backpack for college and travel.", 999, 30, "Fashion", "/images/backpack.jpg"));
            productRepo.save(new Product("Java Programming Book", "Beginner friendly book to learn Java.", 599, 40, "Books", "/images/book.svg"));
            productRepo.save(new Product("Water Bottle", "1 litre steel water bottle.", 349, 50, "Home", "/images/bottle.jpg"));
        } else {
            // products already in the database: fix the images of the sample products
            fixImage("Wireless Mouse", "/images/mouse.jpg");
            fixImage("Bluetooth Headphones", "/images/headphones.jpg");
            fixImage("Running Shoes", "/images/shoes.jpg");
            fixImage("Backpack", "/images/backpack.jpg");
            fixImage("Java Programming Book", "/images/book.svg");
            fixImage("Water Bottle", "/images/bottle.jpg");
        }
    }

    private void fixImage(String name, String imageUrl) {
        for (Product p : productRepo.findAll()) {
            if (name.equals(p.getName()) && p.getImageUrl() != null && p.getImageUrl().contains("picsum.photos")) {
                p.setImageUrl(imageUrl);
                productRepo.save(p);
            }
        }
    }
}
