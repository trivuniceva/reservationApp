package accommodationmodule.accommodationmodule.model;

import jakarta.persistence.*;

import java.util.List;
import lombok.Data;

@Data
@Entity
@Table(name = "properties")
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private String location;
    private String type;
    private int minGuests;
    private int maxGuests;
    private double price;
    private boolean approved = false;
    private Long ownerId;

    @ElementCollection
    @CollectionTable(
            name = "property_amenities",
            joinColumns = @JoinColumn(name = "property_id")
    )
    @Column(name = "amenity_name")
    private List<String> amenities;


    @ElementCollection
    @CollectionTable(
            name = "property_images",
            joinColumns = @JoinColumn(name = "property_id")
    )
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private List<String> images;
}