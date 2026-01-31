package accommodationmodule.accommodationmodule.dto;

import lombok.Data;

@Data
public class PropertyCreatedEvent {

    private final Long propertyId;
    private final String propertyName;

    public PropertyCreatedEvent(Long propertyId, String propertyName) {
        this.propertyId = propertyId;
        this.propertyName = propertyName;
    }
}
