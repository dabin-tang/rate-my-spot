package com.ratemyspot;

import com.ratemyspot.entity.Admin;
import com.ratemyspot.repository.AdminRepository;
import com.ratemyspot.util.PasswordUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }

    @Autowired
    private AdminRepository adminRepository;

    @Test
    void createInitialAdmin() {
        String username = "super_admin";
        String rawPassword = "admin123";

        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setRole("super_admin");

        String hashedPassword = PasswordUtil.hashPassword(rawPassword);
        admin.setPassword(hashedPassword);

        Admin savedAdmin = adminRepository.save(admin);

        assertNotNull(savedAdmin.getId());
        System.out.println("Admin created with ID: " + savedAdmin.getId());
    }


}
