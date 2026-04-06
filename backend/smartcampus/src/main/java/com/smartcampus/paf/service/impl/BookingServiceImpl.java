package com.smartcampus.paf.service.impl;

import com.smartcampus.paf.dto.request.BookingRequestDTO;
import com.smartcampus.paf.dto.response.BookingResponseDTO;
import com.smartcampus.paf.model.Booking;
import com.smartcampus.paf.model.User;
import com.smartcampus.paf.model.enums.BookingStatus;
import com.smartcampus.paf.repository.BookingRepository;
import com.smartcampus.paf.repository.UserRepository;
import com.smartcampus.paf.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate time range
        if (request.getStartTime().isAfter(request.getEndTime())) {
            throw new RuntimeException("Start time must be before end time");
        }

        if (request.getStartTime().equals(request.getEndTime())) {
            throw new RuntimeException("Start time cannot be equal to end time");
        }

        // Check for conflicts
        if (checkConflict(request.getResourceId(), request.getBookingDate(),
                request.getStartTime(), request.getEndTime())) {
            throw new RuntimeException("Time slot already booked for this resource");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResourceId(request.getResourceId());
        booking.setResourceName(request.getResourceName());
        booking.setResourceType(request.getResourceType());
        booking.setResourceLocation(request.getResourceLocation());
        booking.setCapacity(request.getCapacity());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    @Override
    public BookingResponseDTO getBookingById(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToResponse(booking);
    }

    @Override
    public List<BookingResponseDTO> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getUserBookingsByStatus(String userEmail, BookingStatus status) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserAndStatus(user, status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getAllBookings(String status, String resourceId, String userId) {
        BookingStatus bookingStatus = status != null ? BookingStatus.valueOf(status) : null;
        return bookingRepository.findBookingsWithFilters(bookingStatus, resourceId, userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponseDTO approveBooking(String bookingId, String adminEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be approved");
        }

        booking.setStatus(BookingStatus.APPROVED);
        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public BookingResponseDTO rejectBooking(String bookingId, String reason, String adminEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setAdminReason(reason);
        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public BookingResponseDTO cancelBooking(String bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRoles().stream().anyMatch(role -> role.name().equals("ROLE_ADMIN"));
        boolean isOwner = booking.getUser().getEmail().equals(userEmail);

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("You don't have permission to cancel this booking");
        }

        if (booking.getStatus() != BookingStatus.APPROVED && booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending or approved bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public BookingResponseDTO updateBooking(String bookingId, BookingRequestDTO request, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isOwner = booking.getUser().getEmail().equals(userEmail);

        if (!isOwner) {
            throw new RuntimeException("You don't have permission to update this booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Only pending bookings can be updated");
        }

        // Check for conflicts (excluding current booking)
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                request.getResourceId(), request.getBookingDate(),
                request.getStartTime(), request.getEndTime());

        conflicts.removeIf(b -> b.getId().equals(bookingId));

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Time slot already booked for this resource");
        }

        // Update fields
        booking.setResourceId(request.getResourceId());
        booking.setResourceName(request.getResourceName());
        booking.setResourceType(request.getResourceType());
        booking.setResourceLocation(request.getResourceLocation());
        booking.setCapacity(request.getCapacity());
        booking.setBookingDate(request.getBookingDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees());

        Booking saved = bookingRepository.save(booking);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void deleteBooking(String bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRoles().stream().anyMatch(role -> role.name().equals("ROLE_ADMIN"));
        boolean isOwner = booking.getUser().getEmail().equals(userEmail);

        if (!isAdmin && !isOwner) {
            throw new RuntimeException("You don't have permission to delete this booking");
        }

        // Only allow deletion of PENDING or REJECTED bookings
        if (booking.getStatus() == BookingStatus.APPROVED) {
            throw new RuntimeException("Approved bookings cannot be deleted. Please cancel instead.");
        }

        bookingRepository.delete(booking);
    }

    @Override
    public boolean checkConflict(String resourceId, LocalDate date, LocalTime startTime, LocalTime endTime) {
        List<Booking> conflicts = bookingRepository.findConflictingBookings(resourceId, date, startTime, endTime);
        return !conflicts.isEmpty();
    }

    @Override
    public List<LocalTime[]> getAvailableTimeSlots(String resourceId, LocalDate date) {
        List<LocalTime[]> allSlots = new ArrayList<>();
        LocalTime start = LocalTime.of(8, 0); // 8:00 AM
        LocalTime end = LocalTime.of(18, 0); // 6:00 PM
        int slotDuration = 60; // 60 minutes slots

        LocalTime current = start;
        while (current.isBefore(end)) {
            LocalTime slotEnd = current.plusMinutes(slotDuration);
            if (!checkConflict(resourceId, date, current, slotEnd)) {
                allSlots.add(new LocalTime[] { current, slotEnd });
            }
            current = slotEnd;
        }
        return allSlots;
    }

    private BookingResponseDTO mapToResponse(Booking booking) {
        return new BookingResponseDTO(
                booking.getId(),
                booking.getUser().getId(),
                booking.getUser().getEmail(),
                booking.getUser().getName(),
                booking.getResourceId(),
                booking.getResourceName(),
                booking.getResourceType(),
                booking.getResourceLocation(),
                booking.getCapacity(),
                booking.getBookingDate(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getExpectedAttendees(),
                booking.getStatus(),
                booking.getAdminReason(),
                booking.getCreatedAt(),
                booking.getUpdatedAt());
    }
}