package accommodationmodule.accommodationmodule.controller;

import accommodationmodule.accommodationmodule.model.DateRange;
import accommodationmodule.accommodationmodule.model.SpecialPriceRule;
import accommodationmodule.accommodationmodule.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/special-prices")
@CrossOrigin(origins = "http://localhost:4200")
public class SpecialPriceController {

    @Autowired
    private PropertyService propertyService;

    @PostMapping("/pricing/{apartmentId}")
    public ResponseEntity<?> addSpecialPrice(@PathVariable Long apartmentId, @RequestBody SpecialPriceRule priceRule) {
        propertyService.addSpecialPrice(apartmentId, priceRule);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/availability/{apartmentId}")
    public ResponseEntity<?> updateAvailability(@PathVariable Long apartmentId, @RequestBody List<DateRange> intervals) {
        propertyService.setAvailability(apartmentId, intervals);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/reserved/{apartmentId}")
    public ResponseEntity<List<LocalDate>> getReservedDates(@PathVariable Long apartmentId) {
        List<LocalDate> dates = propertyService.getOccupiedDates(apartmentId);
        return ResponseEntity.ok(dates);
    }
}
