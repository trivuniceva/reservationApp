package accommodationmodule.accommodationmodule.service;

import accommodationmodule.accommodationmodule.model.Property;
import accommodationmodule.accommodationmodule.model.SpecialPriceRule;
import accommodationmodule.accommodationmodule.model.DateRange;
import accommodationmodule.accommodationmodule.repository.PropertyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PropertyServiceTest {

    @Mock
    private PropertyRepository propertyRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private PropertyService propertyService;

    private Property testProperty;

    @BeforeEach
    void setUp() {
        testProperty = new Property();
        testProperty.setId(1L);
        testProperty.setName("Test Apartment");
        testProperty.setMinGuests(2);
        testProperty.setMaxGuests(4);
        testProperty.setSpecialPrices(new ArrayList<>());
    }

    @Test
    void testSaveProperty_ThrowsException_WhenMinGreaterThanMax() {
        testProperty.setMinGuests(5);
        testProperty.setMaxGuests(2);

        assertThrows(IllegalArgumentException.class, () -> {
            propertyService.saveProperty(testProperty);
        });
    }

    @Test
    void testAddSpecialPrice_Success() {
        SpecialPriceRule rule = new SpecialPriceRule();
        rule.setPrice(150.0);

        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));

        propertyService.addSpecialPrice(1L, rule);

        assertEquals(1, testProperty.getSpecialPrices().size());
        verify(propertyRepository, times(1)).save(testProperty);
    }

    @Test
    void testSetAvailability_Success() {
        DateRange range = new DateRange();
        range.setStartDate(LocalDate.now());
        range.setEndDate(LocalDate.now().plusDays(2));

        List<DateRange> intervals = List.of(range);
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(testProperty));

        propertyService.setAvailability(1L, intervals);

        assertEquals(intervals, testProperty.getAvailability());
        verify(propertyRepository, times(1)).save(testProperty);
    }
}