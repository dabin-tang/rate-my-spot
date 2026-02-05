package com.ratemyspot.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

/**
 * Features: Logical Expiration, Cache Penetration Protection, and Distributed Mutex Locking.
 * * This component handles high-concurrency caching scenarios to prevent Cache Avalanche and Cache Breakdown.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CacheUtil {

    private final RedisTemplate<String, Object> redisTemplate;
    private final RedissonClient redissonClient;

    // Thread pool for asynchronous cache rebuilding
    private static final ExecutorService REBUILD_EXECUTOR = Executors.newFixedThreadPool(10);

    /**
     * Wrapper class for Logical Expiration.
     * Stores the real data and a logical expiration time to allow serving stale data while rebuilding.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RedisData<T> {
        private LocalDateTime expireTime;
        private T data;
    }

    /**
     * Set cache with Logical Expiration.
     * Note: The actual key in Redis does not have a TTL (or has a very long one).
     *
     * @param key      Cache key
     * @param data     Data to cache
     * @param duration Logical duration
     * @param unit     Time unit
     */
    public <T> void setWithLogicalExpire(String key, T data, long duration, TimeUnit unit) {
        if (data == null) {
            return;
        }
        RedisData<T> redisData = new RedisData<>();
        redisData.setData(data);
        redisData.setExpireTime(LocalDateTime.now().plusSeconds(unit.toSeconds(duration)));
        
        redisTemplate.opsForValue().set(key, redisData);
    }

    /**
     * Set standard cache with TTL (Time To Live).
     * Handles null values by caching an empty string to prevent Cache Penetration.
     *
     * @param key      Cache key
     * @param data     Data to cache
     * @param duration TTL duration
     * @param unit     Time unit
     */
    public <T> void setWithTTL(String key, T data, long duration, TimeUnit unit) {
        if (data == null) {
            // Cache empty string for null values to prevent penetration
            redisTemplate.opsForValue().set(key, "", duration, unit);
        } else {
            redisTemplate.opsForValue().set(key, data, duration, unit);
        }
    }

    /**
     * Query with Logical Expiration (High Availability/Consistency Trade-off).
     * If data is logically expired, it returns stale data immediately and launches an async thread to rebuild cache.
     *
     * @param key         Cache key
     * @param type        Class type of the data
     * @param lockTimeout Time to wait for the lock
     * @param lockUnit    Unit for lock timeout
     * @param duration    Duration for the new data logic expiration
     * @param timeUnit    Unit for data duration
     * @param dbFallback  Function to fetch data from DB if needed
     * @return Data object
     */
    public <T> T queryWithLogicalExpire(
            String key,
            Class<T> type,
            long lockTimeout,
            TimeUnit lockUnit,
            long duration,
            TimeUnit timeUnit,
            Function<String, T> dbFallback
    ) {
        // 1. Query Redis
        Object obj = redisTemplate.opsForValue().get(key);

        // 2. If completely missing, return null (Caller should handle or pre-heat cache)
        if (obj == null) {
            return null;
        }

        // 3. Deserialize
        RedisData<T> redisData;
        try {
            redisData = (RedisData<T>) obj;
        } catch (Exception e) {
            log.warn("Cache data format mismatch for key: {}", key);
            return null;
        }

        // 4. Check if expired
        if (redisData.getExpireTime().isAfter(LocalDateTime.now())) {
            // Not expired, return data
            return redisData.getData();
        }

        // 5. Expired: Try to acquire lock for reconstruction
        String lockKey = key + ":lock";
        RLock lock = redissonClient.getLock(lockKey);

        // tryLock() is non-blocking here (or minimally blocking if args used correctly)
        // We only want one thread to trigger the rebuild
        if (lock.tryLock()) {
            // Double check inside lock
            Object newObj = redisTemplate.opsForValue().get(key);
            if (newObj != null) {
                 RedisData<T> newData = (RedisData<T>) newObj;
                 if (newData.getExpireTime().isAfter(LocalDateTime.now())) {
                     lock.unlock();
                     return newData.getData();
                 }
            }

            // Submit rebuild task to thread pool
            REBUILD_EXECUTOR.submit(() -> {
                try {
                    // Query DB
                    T newDbData = dbFallback.apply(key);
                    // Refresh Cache
                    this.setWithLogicalExpire(key, newDbData, duration, timeUnit);
                } catch (Exception e) {
                    log.error("Async cache rebuild failed for key: {}", key, e);
                } finally {
                    lock.unlock();
                }
            });
        }

        // 6. Return stale data (while async build is happening or if lock failed)
        return redisData.getData();
    }

    /**
     * Query with Pass-Through Protection.
     * Handles the "Cache Penetration" problem by caching null/empty values.
     *
     * @param key        Cache key
     * @param type       Class type
     * @param duration   TTL duration
     * @param unit       Time unit
     * @param dbFallback Database fallback function
     * @return Data object
     */
    public <T> T queryWithPassThrough(
            String key,
            Class<T> type,
            long duration,
            TimeUnit unit,
            Function<String, T> dbFallback
    ) {
        // 1. Query Redis
        Object value = redisTemplate.opsForValue().get(key);

        // 2. Check if exists
        if (value != null) {
            // Check for empty string (Cached Null)
            if (value instanceof String && !StringUtils.hasLength((String) value)) {
                return null;
            }
            return (T) value;
        }

        // 3. Query Database
        T dbData = dbFallback.apply(key);

        // 4. Write back to Redis
        if (dbData == null) {
            // Cache empty string to prevent penetration
            redisTemplate.opsForValue().set(key, "", duration, unit);
        } else {
            redisTemplate.opsForValue().set(key, dbData, duration, unit);
        }

        return dbData;
    }

    /**
     * Query with Mutex Lock (Strong Consistency).
     * Prevents "Cache Breakdown" by locking so only one thread queries the DB.
     *
     * @param key         Cache key
     * @param type        Class type
     * @param lockTimeout Lock wait time
     * @param lockUnit    Lock unit
     * @param duration    Data TTL
     * @param timeUnit    Data unit
     * @param dbFallback  Database fallback function
     * @return Data object
     */
    public <T> T queryWithMutex(
            String key,
            Class<T> type,
            long lockTimeout,
            TimeUnit lockUnit,
            long duration,
            TimeUnit timeUnit,
            Function<String, T> dbFallback
    ) {
        // 1. Query Redis
        Object value = redisTemplate.opsForValue().get(key);
        if (value != null) {
            if (value instanceof String && !StringUtils.hasLength((String) value)) {
                return null;
            }
            return (T) value;
        }

        // 2. Acquire Mutex Lock
        String lockKey = key + ":mutex";
        RLock lock = redissonClient.getLock(lockKey);
        boolean isLocked = false;

        try {
            // Try to acquire lock (blocking with wait time)
            isLocked = lock.tryLock(lockTimeout, lockUnit);
            
            if (!isLocked) {
                // Failed to acquire lock, sleep and retry (recursive or loop)
                Thread.sleep(50);
                return queryWithMutex(key, type, lockTimeout, lockUnit, duration, timeUnit, dbFallback);
            }

            // 3. Double Check
            value = redisTemplate.opsForValue().get(key);
            if (value != null) {
                if (value instanceof String && !StringUtils.hasLength((String) value)) {
                    return null;
                }
                return (T) value;
            }

            // 4. Query DB
            T dbData = dbFallback.apply(key);

            // 5. Write to Redis
            if (dbData == null) {
                redisTemplate.opsForValue().set(key, "", duration, timeUnit);
            } else {
                redisTemplate.opsForValue().set(key, dbData, duration, timeUnit);
            }

            return dbData;

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Cache query interrupted", e);
        } finally {
            if (isLocked && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}