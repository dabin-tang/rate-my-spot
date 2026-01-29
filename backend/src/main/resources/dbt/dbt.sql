/*
 Target Server Type    : MySQL
 Target Server Version : 8.0 (Compatible with 5.7+)
 File Encoding         : 65001 (UTF-8)
 Database Name         : rate_my_spot
*/

CREATE DATABASE IF NOT EXISTS `rate_my_spot` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;


-- 1. Table: admin
-- Description: Separate table for backend administrators.

DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
                         `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
                         `username` varchar(32) NOT NULL COMMENT 'Admin login username',
                         `password` varchar(128) NOT NULL COMMENT 'Encrypted password',
                         `role` varchar(32) DEFAULT 'admin' COMMENT 'Role permissions (e.g., super_admin, moderator)',
                         `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `idx_username` (`username`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Administrator accounts for the dashboard';


-- 2. Table: user
-- Description: Unified C-end user table.

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
                        `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
                        `email` varchar(128) NOT NULL COMMENT 'User email (Login ID), unique and mandatory',
                        `password` varchar(128) NOT NULL COMMENT 'Encrypted password',
                        `nickname` varchar(32) DEFAULT '' COMMENT 'Display name',
                        `icon` varchar(255) DEFAULT '' COMMENT 'Avatar URL',
                        `city` varchar(64) DEFAULT '' COMMENT 'City name',
                        `intro` varchar(128) DEFAULT NULL COMMENT 'Short self-introduction/bio',
                        `gender` tinyint(1) UNSIGNED DEFAULT 0 COMMENT '0: Unknown, 1: Male, 2: Female',
                        `credit` int(10) DEFAULT 0 COMMENT 'User credit/points for gamification',
                        `status` tinyint(1) UNSIGNED DEFAULT 0 COMMENT '0: Active, 1: Banned',
                        `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Registration time',
                        `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time',
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `idx_email` (`email`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='User information and profile';


-- 3. Table: follow
-- Description: Social graph (User A follows User B).

DROP TABLE IF EXISTS `follow`;
CREATE TABLE `follow` (
                          `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
                          `user_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Follower ID (Who is following)',
                          `follow_user_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Target ID (Who is being followed)',
                          `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Follow time',
                          PRIMARY KEY (`id`),
                          KEY `idx_user_follow` (`user_id`, `follow_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='User follow relationships';


-- 4. Table: spot_category
-- Description: Categories for spots (e.g., Park, Cafe).

DROP TABLE IF EXISTS `spot_category`;
CREATE TABLE `spot_category` (
                                 `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
                                 `name` varchar(32) NOT NULL COMMENT 'Category name',
                                 `icon` varchar(255) DEFAULT NULL COMMENT 'Icon URL for the category',
                                 `sort` int(3) UNSIGNED DEFAULT 0 COMMENT 'Sort order weight',
                                 `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                 PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Categories for spots';


-- 5. Table: spot
-- Description: The core entity. Includes location (x, y) and aggregate scores.

DROP TABLE IF EXISTS `spot`;
CREATE TABLE `spot` (
                        `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
                        `name` varchar(128) NOT NULL COMMENT 'Spot name',
                        `category_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Foreign Key: Category ID',
                        `description` text COMMENT 'Detailed description of the spot',
                        `address` varchar(255) NOT NULL COMMENT 'Physical address string',
                        `images` varchar(1024) DEFAULT NULL COMMENT 'Comma-separated URLs of spot images',
                        `x` double NOT NULL COMMENT 'Longitude for geolocation',
                        `y` double NOT NULL COMMENT 'Latitude for geolocation',
                        `score` decimal(2,1) UNSIGNED DEFAULT 0.0 COMMENT 'Aggregate score (calculated from reviews + posts)',
                        `review_count` int(10) UNSIGNED DEFAULT 0 COMMENT 'Total number of reviews + posts',
                        `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Creation time',
                        `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time',
                        PRIMARY KEY (`id`),
                        KEY `idx_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Spots/Locations information';


-- 6. Table: spot_review
-- Description: Google Maps style reviews (Rating is mandatory).

DROP TABLE IF EXISTS `spot_review`;
CREATE TABLE `spot_review` (
                               `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
                               `spot_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Foreign Key: Spot ID',
                               `user_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Foreign Key: User ID',
                               `rating` tinyint(1) UNSIGNED NOT NULL COMMENT 'Rating 1-5 stars (Mandatory)',
                               `content` varchar(1024) DEFAULT NULL COMMENT 'Text content (Optional)',
                               `images` varchar(2048) DEFAULT NULL COMMENT 'Comma-separated image URLs (Optional)',
                               `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Review time',
                               PRIMARY KEY (`id`),
                               KEY `idx_spot_id` (`spot_id`),
                               KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Direct reviews for spots (Lightweight)';


-- 7. Table: post
-- Description: Instagram style posts (Rating is mandatory).

DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
                        `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
                        `spot_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Foreign Key: Spot ID',
                        `user_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Foreign Key: User ID',
                        `title` varchar(255) NOT NULL COMMENT 'Post title',
                        `content` text NOT NULL COMMENT 'Post main text content',
                        `images` varchar(2048) NOT NULL COMMENT 'Comma-separated image URLs',
                        `rating` tinyint(1) UNSIGNED NOT NULL COMMENT 'Rating 1-5 stars (Mandatory, affects Spot score)',
                        `liked` int(8) UNSIGNED DEFAULT 0 COMMENT 'Like count',
                        `status` tinyint(1) UNSIGNED DEFAULT 0 COMMENT '0: Active, 1: Under Review, 2: Hidden',
                        `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Post time',
                        `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update time',
                        PRIMARY KEY (`id`),
                        KEY `idx_spot_id` (`spot_id`),
                        KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Social posts about spots (Heavyweight)';


-- 8. Table: post_comment
-- Description: Nested comments for Posts. Supports Text and/or Image.

DROP TABLE IF EXISTS `post_comment`;
CREATE TABLE `post_comment` (
                                `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
                                `post_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Foreign Key: Post ID',
                                `user_id` bigint(20) UNSIGNED NOT NULL COMMENT 'Foreign Key: User ID',
                                `parent_id` bigint(20) UNSIGNED DEFAULT 0 COMMENT 'Parent Comment ID (0 for top-level comments)',
                                `reply_to_user_id` bigint(20) UNSIGNED DEFAULT NULL COMMENT 'User ID being replied to (Optional, for UI display)',
                                `content` varchar(1024) DEFAULT NULL COMMENT 'Text content (Optional if image exists)',
                                `image` varchar(255) DEFAULT NULL COMMENT 'Single image URL (Optional if text exists)',
                                `liked` int(8) UNSIGNED DEFAULT 0 COMMENT 'Like count',
                                `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Comment time',
                                PRIMARY KEY (`id`),
                                KEY `idx_post_id` (`post_id`),
                                KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Comments on posts (Supports nesting and images)';


-- 9. Table: post_like (Optional) //But I don't use it~
-- Description: To track who liked which post (prevents duplicate likes).

DROP TABLE IF EXISTS `post_like`;
CREATE TABLE `post_like` (
                             `id` bigint(20) NOT NULL AUTO_INCREMENT,
                             `post_id` bigint(20) UNSIGNED NOT NULL,
                             `user_id` bigint(20) UNSIGNED NOT NULL,
                             `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             PRIMARY KEY (`id`),
                             UNIQUE KEY `idx_user_like` (`user_id`, `post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Track user likes on posts';

SET FOREIGN_KEY_CHECKS = 1;