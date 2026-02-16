package accommodationmodule.accommodationmodule.controller;

import accommodationmodule.accommodationmodule.model.Reservation;
import accommodationmodule.accommodationmodule.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:4200")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Reservation> create(@RequestBody Reservation res) {
        return ResponseEntity.ok(reservationService.createRequest(res));
    }

    @GetMapping("/guest/{guestId}")
    public List<Reservation> getByGuest(@PathVariable Long guestId) {
        return reservationService.getForGuest(guestId);
    }

    @GetMapping("/host/{hostId}")
    public List<Reservation> getByHost(@PathVariable Long hostId) {
        return reservationService.getForHost(hostId);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> accept(@PathVariable Long id) {
        reservationService.acceptReservation(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id) {
        reservationService.rejectReservation(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        reservationService.deletePendingRequest(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/property/{propertyId}/reserved-dates")
    public List<LocalDate> getReservedDates(@PathVariable Long propertyId) {
        return reservationService.getReservedDatesForProperty(propertyId);
    }
}