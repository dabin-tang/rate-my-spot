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
@Schema(name = "UserSearchResponse", description = "User Search Result Response")
public class UserSearchResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "User ID", example = "1001")
    private Long id;

    @Schema(description = "Display Name", example = "Dabin")
    private String nickname;

    @Schema(description = "Avatar URL", example = "https://example.com/icon.jpg")
    private String icon;

    @Schema(description = "Gender (0:Unknown, 1:Male, 2:Female)", example = "1")
    private Integer gender;

    @Schema(description = "Whether the current user is following this profile user", example = "false")
    private Boolean isFollowing = false;

    @Schema(description = "Registration Time")
    private LocalDateTime createTime;

    /**
     * Constructor for JPQL Projection.
     * isFollowing defaults to false and will be populated within the Service layer if the user is logged in.
     */
    public UserSearchResponse(Long id, String nickname, String icon, Integer gender, LocalDateTime createTime) {
        this.id = id;
        this.nickname = nickname;
        this.icon = icon;
        this.gender = gender;
        this.createTime = createTime;
        this.isFollowing = false;
    }
}
