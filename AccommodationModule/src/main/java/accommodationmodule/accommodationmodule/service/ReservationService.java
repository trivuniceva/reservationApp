package accommodationmodule.accommodationmodule.service;

import accommodationmodule.accommodationmodule.model.*;
import accommodationmodule.accommodationmodule.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
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

        if (res.getReservedDates() == null || res.getReservedDates().isEmpty()) {
            List<LocalDate> allDates = res.getStartDate().datesUntil(res.getEndDate().plusDays(1)).collect(Collectors.toList());
            res.setReservedDates(allDates);
        }

        List<Reservation> accepted = reservationRepository.findByPropertyIdAndStatus(p.getId(), ReservationStatus.ACCEPTED);

        for (Reservation a : accepted) {
            if (!Collections.disjoint(a.getReservedDates(), res.getReservedDates())) {
                throw new RuntimeException("Termin je zauzet!");
            }
        }

        if (p.isAutoConfirm()) {
            res.setStatus(ReservationStatus.ACCEPTED);
            updatePropertyAvailability(p, res.getReservedDates());
            reservationRepository.save(res);
            autoRejectOverlapping(res);
        } else {
            res.setStatus(ReservationStatus.PENDING);
        }
        return reservationRepository.save(res);
    }

    @Transactional
    public void acceptReservation(Long id) {
        Reservation res = reservationRepository.findById(id).orElseThrow();
        res.setStatus(ReservationStatus.ACCEPTED);
        updatePropertyAvailability(res.getProperty(), res.getReservedDates());
        reservationRepository.save(res);
        autoRejectOverlapping(res);
    }

    private void updatePropertyAvailability(Property property, List<LocalDate> reservedDates) {
        List<DateRange> currentAvailability = property.getAvailability();
        List<DateRange> newAvailability = new ArrayList<>();

        for (DateRange range : currentAvailability) {
            List<LocalDate> rangeDates = range.getStartDate().datesUntil(range.getEndDate().plusDays(1)).collect(Collectors.toList());
            rangeDates.removeAll(reservedDates);

            if (!rangeDates.isEmpty()) {
                newAvailability.addAll(convertToIntervals(rangeDates));
            }
        }
        property.setAvailability(newAvailability);
    }

    private List<DateRange> convertToIntervals(List<LocalDate> dates) {
        Collections.sort(dates);
        List<DateRange> intervals = new ArrayList<>();
        if (dates.isEmpty()) return intervals;

        LocalDate start = dates.get(0);
        LocalDate end = dates.get(0);

        for (int i = 1; i < dates.size(); i++) {
            if (dates.get(i).equals(end.plusDays(1))) {
                end = dates.get(i);
            } else {
                DateRange dr = new DateRange();
                dr.setStartDate(start);
                dr.setEndDate(end);
                intervals.add(dr);
                start = dates.get(i);
                end = dates.get(i);
            }
        }
        DateRange lastDr = new DateRange();
        lastDr.setStartDate(start);
        lastDr.setEndDate(end);
        intervals.add(lastDr);
        return intervals;
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
        Property p = res.getProperty();
        p.getAvailability().addAll(convertToIntervals(res.getReservedDates()));
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

    public List<LocalDate> getReservedDatesForProperty(Long propertyId) {
        return reservationRepository.findAllReservedDatesRaw(propertyId)
                .stream()
                .flatMap(List::stream)
                .collect(Collectors.toList());
    }
}