package com.ratemyspot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

@Configuration
public class ThreadPoolConfig {

    @Bean(name = "cacheRebuildExecutor")
    public Executor cacheRebuildExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        // Core threads: Keep alive even when idle
        executor.setCorePoolSize(10);
        // Max threads: Limit to prevent resource exhaustion
        executor.setMaxPoolSize(20);
        // Queue capacity: Buffer for incoming tasks
        executor.setQueueCapacity(200);
        // Thread name prefix for easier debugging in logs
        executor.setThreadNamePrefix("cache-rebuild-");
        // Keep alive time for excess threads
        executor.setKeepAliveSeconds(60);
        // Rejection policy: Run in the caller thread if the pool is full (prevents data loss)
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        
        executor.initialize();
        return executor;
    }
}