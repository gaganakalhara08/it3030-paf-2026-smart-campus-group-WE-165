package com.smartcampus.paf.dto.request;

import com.smartcampus.paf.model.enums.TicketCategory;
import com.smartcampus.paf.model.enums.TicketPriority;
import com.smartcampus.paf.model.enums.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateTicketRequestDTO {
    
    private String title;
    
    private String description;
    
    private TicketCategory category;
    
    private TicketPriority priority;
    
    private String contactEmail;
    
    private String contactPhone;
    
    private String resolutionNotes;
}
