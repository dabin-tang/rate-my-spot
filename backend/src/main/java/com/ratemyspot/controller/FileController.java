package com.ratemyspot.controller;

import com.ratemyspot.util.Result;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping("/api/file")
@Tag(name = "FileController", description = "File Upload APIs")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    @Value("${file.upload-dir:C:\\imgStore}")
    private String baseUploadDir;

    @Value("${server.port:8081}")
    private String serverPort;

    /**
     * Upload a file and return its static URL.
     *
     * @param file The file to upload
     * @return The accessible URL of the uploaded file
     */
    @Operation(summary = "Upload File", description = "Upload a file and return static URL")
    @PostMapping("/upload")
    public Result<String> upload(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return Result.fail("File is empty");
        }

        try {
            // Generate date-based sub-directory (e.g., /2025/12/21/)
            String datePath = new SimpleDateFormat("/yyyy/MM/dd/").format(new Date());

            // Ensure directory exists
            File saveDir = new File(baseUploadDir + datePath);
            if (!saveDir.exists()) {
                saveDir.mkdirs();
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String suffix = "";
            if (originalFilename != null && originalFilename.lastIndexOf('.') != -1) {
                suffix = originalFilename.substring(originalFilename.lastIndexOf('.'));
            }
            String newFileName = UUID.randomUUID().toString() + suffix;

            // Save file to disk
            File dest = new File(saveDir, newFileName);
            file.transferTo(dest);

            // Generate Access URL (Assuming localhost for dev environment)
            // Ideally, the domain should be configurable
            String fileUrl = "http://localhost:" + serverPort + "/files" + datePath + newFileName;

            log.info("File uploaded successfully: {}", dest.getAbsolutePath());
            return Result.ok(fileUrl);

        } catch (IOException e) {
            log.error("Upload failed", e);
            return Result.fail("Upload failed: " + e.getMessage());
        }
    }
}