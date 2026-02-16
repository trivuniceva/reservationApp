package accommodationmodule.accommodationmodule.service;

import accommodationmodule.accommodationmodule.model.*;
import accommodationmodule.accommodationmodule.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private PropertyService propertyService;

    @Transactional
    public Reservation createRequest(Reservation res) {
        Property p = propertyService.getPropertyById(res.getProperty().getId());
        res.setProperty(p);

        List<Reservation> accepted = reservationRepository.findPendingByProperty(p.getId()).stream()
                .filter(r -> r.getStatus() == ReservationStatus.ACCEPTED)
                .collect(Collectors.toList());

        for (Reservation a : accepted) {
            if (!Collections.disjoint(a.getReservedDates(), res.getReservedDates())) {
                throw new RuntimeException("Termin je zauzet!");
            }
        }

        if (p.isAutoConfirm()) {
            res.setStatus(ReservationStatus.ACCEPTED);
            reservationRepository.save(res);
            autoRejectOverlapping(res);
        } else {
            res.setStatus(ReservationStatus.PENDING);
        }
        System.out.println("rezervisao");
        return reservationRepository.save(res);
    }

    @Transactional
    public void acceptReservation(Long id) {
        Reservation res = reservationRepository.findById(id).orElseThrow();
        res.setStatus(ReservationStatus.ACCEPTED);
        reservationRepository.save(res);

        autoRejectOverlapping(res);
    }

    private void autoRejectOverlapping(Reservation acceptedRes) {
        List<Reservation> pendings = reservationRepository.findPendingByProperty(acceptedRes.getProperty().getId());

        for (Reservation p : pendings) {
            if (p.getId().equals(acceptedRes.getId())) continue;

            if (!Collections.disjoint(p.getReservedDates(), acceptedRes.getReservedDates())) {
                p.setStatus(ReservationStatus.REJECTED);
                reservationRepository.save(p);
            }
        }
    }

    @Transactional
    public void rejectReservation(Long id) {
        Reservation res = reservationRepository.findById(id).orElseThrow();
        res.setStatus(ReservationStatus.REJECTED);
        reservationRepository.save(res);
    }

    @Transactional
    public void cancelReservation(Long id) {
        Reservation res = reservationRepository.findById(id).orElseThrow();

        LocalDate deadline = res.getStartDate().minusDays(res.getProperty().getCancellationDeadline());
        if (LocalDate.now().isAfter(deadline)) {
            throw new RuntimeException("Prošao je rok za otkazivanje!");
        }

        res.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(res);
    }

    public List<Reservation> getForGuest(Long guestId) {
        return reservationRepository.findByGuestId(guestId);
    }

    public List<Reservation> getForHost(Long hostId) {
        List<Reservation> reservations = reservationRepository.findByPropertyOwnerId(hostId);
        reservations.forEach(r -> {
            r.setGuestCancellationCount(reservationRepository.countByGuestIdAndStatus(r.getGuestId(), ReservationStatus.CANCELLED));
        });
        return reservations;
    }

    @Transactional
    public void deletePendingRequest(Long id) {
        Reservation res = reservationRepository.findById(id).orElseThrow();
        if (res.getStatus() == ReservationStatus.PENDING) {
            reservationRepository.delete(res);
        } else {
            throw new RuntimeException("Samo zahtevi na čekanju se mogu obrisati.");
        }
    }
}