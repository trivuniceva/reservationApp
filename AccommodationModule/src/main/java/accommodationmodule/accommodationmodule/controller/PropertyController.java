package accommodationmodule.accommodationmodule.controller;

import accommodationmodule.accommodationmodule.model.Property;
import accommodationmodule.accommodationmodule.service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @PostMapping
    public ResponseEntity<Property> createProperty(@RequestBody Property property) {
        Property savedProperty = propertyService.saveProperty(property);
        return new ResponseEntity<>(savedProperty, HttpStatus.CREATED);
    }

    @GetMapping("/approved")
    public List<Property> getApproved() {
        return propertyService.getApprovedProperties();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Property> approve(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.approveProperty(id));
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Property>> getByOwner(@PathVariable Long ownerId) {
        List<Property> properties = propertyService.getPropertiesByOwner(ownerId);
        return ResponseEntity.ok(properties);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Property> updateProperty(@PathVariable Long id, @RequestBody Property updatedProperty) {
        Property property = propertyService.updateProperty(id, updatedProperty);
        return ResponseEntity.ok(property);
    }

}
