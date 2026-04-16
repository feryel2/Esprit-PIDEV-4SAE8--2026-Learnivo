package com.learnivo.demo.dto.ticket;

import com.learnivo.demo.enums.TicketPriority;
import com.learnivo.demo.enums.TicketStatus;

public class TicketUpdateDTO {
    private TicketStatus status;
    private TicketPriority priority;

    public TicketUpdateDTO() {}

    public TicketUpdateDTO(TicketStatus status, TicketPriority priority) {
        this.status = status;
        this.priority = priority;
    }

    public TicketStatus getStatus() { return status; }
    public void setStatus(TicketStatus status) { this.status = status; }

    public TicketPriority getPriority() { return priority; }
    public void setPriority(TicketPriority priority) { this.priority = priority; }
}
