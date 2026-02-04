package com.ratemyspot.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private JwtInterceptor jwtInterceptor;

    // Read the file upload directory from the configuration file.
    // If not found, it defaults to C:\imgStore
    @Value("${file.upload-dir:C:\\imgStore}")
    private String baseUploadDir;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Register the JWT interceptor to check login status for all requests.
        // The specific whitelist (paths that do not require login) is handled inside JwtInterceptor.
        registry.addInterceptor(jwtInterceptor)
                .addPathPatterns("/**");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Enable Cross-Origin Resource Sharing (CORS).
        // This allows the frontend running on localhost:5173 to communicate with the backend.
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map the URL path "/files/**" to the local file system directory.
        // This allows the browser to access uploaded images directly by URL.
        String location = "file:" + baseUploadDir;
        if (!location.endsWith("\\") && !location.endsWith("/")) {
            location += File.separator;
        }

        registry.addResourceHandler("/files/**")
                .addResourceLocations(location);
    }
}