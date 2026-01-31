package accommodationmodule.accommodationmodule.service;

import accommodationmodule.accommodationmodule.dto.PropertyCreatedEvent;
import accommodationmodule.accommodationmodule.model.Property;
import accommodationmodule.accommodationmodule.repository.PropertyRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;

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

        PropertyCreatedEvent event = new PropertyCreatedEvent(
                savedProperty.getId(),
                savedProperty.getName()
        );

        eventPublisher.publishEvent(event);

        return savedProperty;

    }

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public List<Property> getApprovedProperties() {
        return propertyRepository.findByApprovedTrue();
    }

    public Property approveProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        property.setApproved(true);
        return propertyRepository.save(property);
    }

    public List<Property> getPropertiesByOwner(Long ownerId) {
        return propertyRepository.findByOwnerId(ownerId);
    }
}