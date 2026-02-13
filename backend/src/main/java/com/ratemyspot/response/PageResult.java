package com.ratemyspot.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Pagination Result Wrapper")
public class PageResult<T> implements Serializable {

    @Schema(description = "Current Page Number (1-based)", example = "1")
    private int page;

    @Schema(description = "Page Size", example = "10")
    private int size;

    @Schema(description = "Total Records", example = "100")
    private long total;

    @Schema(description = "Total Pages", example = "10")
    private int totalPages;

    @Schema(description = "Data List")
    private List<T> list;
}
