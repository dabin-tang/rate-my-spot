package com.ratemyspot.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpotRatingDTO {

    /**
     * Total count of ratings (reviews/posts)
     */
    private Long count;

    /**
     * Average score
     */
    private Double avgScore;
}
