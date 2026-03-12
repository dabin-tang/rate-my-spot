package com.ratemyspot.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Schema(name = "AdminStatsResponse", description = "System Statistics Response")
public class AdminStatsResponse {

    @Schema(description = "Total registered users", example = "5000")
    private Long totalUsers;

    @Schema(description = "Total posts", example = "12000")
    private Long totalPosts;

    @Schema(description = "Number of posts created today", example = "42")
    private Long todayPosts;

    @Schema(description = "Total spots", example = "300")
    private Long totalSpots;
}
