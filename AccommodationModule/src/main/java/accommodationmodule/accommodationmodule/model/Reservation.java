package accommodationmodule.accommodationmodule.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;

    private Long guestId;

    @ElementCollection
    private List<LocalDate> reservedDates;

    private LocalDate startDate;
    private LocalDate endDate;
    private int numberOfGuests;
    private double totalPrice;

    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    private LocalDate createdAt = LocalDate.now();

    @Transient
    private int guestCancellationCount;
}