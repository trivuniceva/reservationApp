package accommodationmodule.accommodationmodule.repository;

import accommodationmodule.accommodationmodule.model.Reservation;
import accommodationmodule.accommodationmodule.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByGuestId(Long guestId);

    List<Reservation> findByPropertyOwnerId(Long ownerId);

    @Query("SELECT r FROM Reservation r WHERE r.status = 'PENDING' AND r.property.id = :propertyId")
    List<Reservation> findPendingByProperty(Long propertyId);

    int countByGuestIdAndStatus(Long guestId, ReservationStatus status);
}