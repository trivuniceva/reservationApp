package accommodationmodule.accommodationmodule.repository;

import accommodationmodule.accommodationmodule.model.Property;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class PropertyRepositoryTest {

    @Autowired
    private PropertyRepository propertyRepository;

    @Test
    void testFindByApprovedTrue() {
        List<Property> result = propertyRepository.findByApprovedTrue();

        assertFalse(result.isEmpty(), "Lista odobrenih smeštaja ne sme biti prazna");

        for (Property p : result) {
            assertTrue(p.isApproved());
        }
    }
}