package accommodationmodule.accommodationmodule.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.time.LocalDate;

@Embeddable
@Data
public
class DateRange {
    private LocalDate startDate;
    private LocalDate endDate;
}
