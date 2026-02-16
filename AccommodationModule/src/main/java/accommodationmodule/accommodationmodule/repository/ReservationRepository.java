package accommodationmodule.accommodationmodule.repository;

import accommodationmodule.accommodationmodule.model.Reservation;
import accommodationmodule.accommodationmodule.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByGuestId(Long guestId);

    List<Reservation> findByPropertyOwnerId(Long ownerId);

    @Query("SELECT r FROM Reservation r WHERE r.status = 'PENDING' AND r.property.id = :propertyId")
    List<Reservation> findPendingByProperty(Long propertyId);

    int countByGuestIdAndStatus(Long guestId, ReservationStatus status);

    @Query("SELECT r.reservedDates FROM Reservation r WHERE r.property.id = :propertyId AND r.status = 'ACCEPTED'")
    List<List<LocalDate>> findAllReservedDatesRaw(@Param("propertyId") Long propertyId);

    List<Reservation> findByPropertyIdAndStatus(Long id, ReservationStatus accepted);
}