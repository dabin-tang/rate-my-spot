package com.ratemyspot.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "spot_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
@Schema(name = "SpotCategory", description = "Spot Category Entity")
public class SpotCategory implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Schema(description = "Category ID", example = "1")
    private Long id;

    /**
     * Category Name
     */
    @Column(name = "name", length = 32, nullable = false)
    @Schema(description = "Category Name", example = "Park")
    private String name;

    /**
     * Category Icon URL
     */
    @Column(name = "icon", length = 255)
    @Schema(description = "Category Icon URL", example = "https://example.com/icons/park.png")
    private String icon;

    /**
     * Sort Order (Lower number means higher priority)
     */
    @Column(name = "sort")
    @Schema(description = "Sort Order", example = "10")
    private Integer sort;

    /**
     * Creation Time
     */
    @Column(name = "create_time", nullable = false)
    @Schema(description = "Creation Time")
    private LocalDateTime createTime;

    /**
     * Last Update Time
     */
    @Column(name = "update_time", nullable = false)
    @Schema(description = "Last Update Time")
    private LocalDateTime updateTime;
}