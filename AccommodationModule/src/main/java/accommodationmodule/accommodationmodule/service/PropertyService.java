package accommodationmodule.accommodationmodule.service;

import accommodationmodule.accommodationmodule.dto.PropertyCreatedEvent;
import accommodationmodule.accommodationmodule.model.DateRange;
import accommodationmodule.accommodationmodule.model.Property;
import accommodationmodule.accommodationmodule.model.SpecialPriceRule;
import accommodationmodule.accommodationmodule.repository.PropertyRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private ApplicationEventPublisher eventPublisher;

    @Transactional
    public Property saveProperty(Property property) {
        property.setApproved(false);
        if (property.getMinGuests() > property.getMaxGuests()) {
            throw new IllegalArgumentException("Min guests cannot be greater than max guests");
        }
        Property savedProperty = propertyRepository.save(property);
        eventPublisher.publishEvent(new PropertyCreatedEvent(savedProperty.getId(), savedProperty.getName()));
        return savedProperty;
    }

    public Property updateProperty(Long id, Property updatedProperty) {
        Property existingProperty = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));

        existingProperty.setName(updatedProperty.getName());
        existingProperty.setDescription(updatedProperty.getDescription());
        existingProperty.setLocation(updatedProperty.getLocation());
        existingProperty.setMinGuests(updatedProperty.getMinGuests());
        existingProperty.setMaxGuests(updatedProperty.getMaxGuests());
        existingProperty.setAmenities(updatedProperty.getAmenities());
        existingProperty.setImages(updatedProperty.getImages());

        existingProperty.setCancellationDeadline(updatedProperty.getCancellationDeadline());
        existingProperty.setPricingStrategy(updatedProperty.getPricingStrategy());

        existingProperty.setApproved(false);
        return propertyRepository.save(existingProperty);
    }

    @Transactional
    public void addSpecialPrice(Long id, SpecialPriceRule rule) {
        Property p = propertyRepository.findById(id).orElseThrow();
        if (p.getSpecialPrices() == null) p.setSpecialPrices(new ArrayList<>());
        p.getSpecialPrices().add(rule);
        propertyRepository.save(p);
    }

    @Transactional
    public void setAvailability(Long id, List<DateRange> intervals) {
        Property p = propertyRepository.findById(id).orElseThrow();
        p.setAvailability(intervals);
        propertyRepository.save(p);
    }

    public List<LocalDate> getOccupiedDates(Long id) {
        Property p = propertyRepository.findById(id).orElseThrow();
        if (p.getAvailability() == null) return new ArrayList<>();

        return p.getAvailability().stream()
                .flatMap(range -> range.getStartDate().datesUntil(range.getEndDate().plusDays(1)))
                .collect(Collectors.toList());
    }

    public List<Property> getApprovedProperties() {
        return propertyRepository.findByApprovedTrue();
    }

    public List<Property> getPropertiesByOwner(Long ownerId) {
        return propertyRepository.findByOwnerId(ownerId);
    }

    public Property approveProperty(Long id) {
        Property property = propertyRepository.findById(id).orElseThrow();
        property.setApproved(true);
        return propertyRepository.save(property);
    }

    public List<Property> getAllProperties() {
        return propertyRepository.findByApprovedTrue();
    }

    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));
    }
}