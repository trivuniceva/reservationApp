package accommodationmodule.accommodationmodule.model;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.time.LocalDate;

@Embeddable
@Data
public
class SpecialPriceRule {
    private LocalDate startDate;
    private LocalDate endDate;
    private double price;
}
