package com.ratemyspot.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@Schema(name = "UserProfileResponse", description = "User Public Profile Response VO")
public class UserProfileResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "User ID", example = "1001")
    private Long id;

    @Schema(description = "Display Name", example = "Dabin")
    private String nickname;

    @Schema(description = "Avatar URL", example = "https://example.com/icon.jpg")
    private String icon;

    @Schema(description = "Gender (0:Unknown, 1:Male, 2:Female)", example = "1")
    private Integer gender;

    @Schema(description = "City", example = "New York")
    private String city;

    @Schema(description = "Self Introduction", example = "CS Student @ QC")
    private String intro;

    @Schema(description = "Registration Time")
    private LocalDateTime createTime;

    @Schema(description = "Number of followers", example = "100")
    private Long followersCount;

    @Schema(description = "Number of users followed", example = "50")
    private Long followingCount;

    @Schema(description = "Whether the current user is following this profile user", example = "false")
    private Boolean isFollowing = false;
}
