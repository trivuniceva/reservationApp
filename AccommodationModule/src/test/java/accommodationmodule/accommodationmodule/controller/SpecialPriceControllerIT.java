package accommodationmodule.accommodationmodule.controller;

import accommodationmodule.accommodationmodule.model.DateRange;
import accommodationmodule.accommodationmodule.model.Property;
import accommodationmodule.accommodationmodule.model.SpecialPriceRule;
import accommodationmodule.accommodationmodule.repository.PropertyRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class SpecialPriceControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PropertyRepository propertyRepository;

    @Test
    @WithMockUser(roles = "HOST")
    void testUpdateAvailability_Integration() throws Exception {
        Property p = new Property();
        p.setName("IT Property");
        p = propertyRepository.save(p);

        DateRange range = new DateRange();
        range.setStartDate(LocalDate.now());
        range.setEndDate(LocalDate.now().plusDays(3));

        List<DateRange> intervals = List.of(range);

        mockMvc.perform(put("/special-prices/availability/" + p.getId())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(intervals)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "HOST")
    void testAddPricing_Integration() throws Exception {
        Property p = new Property();
        p.setName("Pricing Property");
        p = propertyRepository.save(p);

        SpecialPriceRule rule = new SpecialPriceRule();
        rule.setPrice(200.0);
        rule.setStartDate(LocalDate.now());
        rule.setEndDate(LocalDate.now().plusDays(1));

        mockMvc.perform(post("/special-prices/pricing/" + p.getId())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(rule)))
                .andExpect(status().isOk());
    }
}