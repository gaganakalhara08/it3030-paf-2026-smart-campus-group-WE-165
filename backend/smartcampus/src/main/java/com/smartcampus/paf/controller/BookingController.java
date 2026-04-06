package com.smartcampus.paf.controller;

import com.smartcampus.paf.dto.request.BookingActionRequestDTO;
import com.smartcampus.paf.dto.request.BookingRequestDTO;
import com.smartcampus.paf.dto.response.BookingResponseDTO;
import com.smartcampus.paf.model.enums.BookingStatus;
import com.smartcampus.paf.security.JwtTokenProvider;
import com.smartcampus.paf.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final JwtTokenProvider jwtTokenProvider;

    private String getEmailFromToken(String authHeader) {
        String token = authHeader.substring(7);
        return jwtTokenProvider.getEmailFromToken(token);
    }

    // ==================== CREATE ====================

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO request,
            @RequestHeader("Authorization") String authHeader) {
        String userEmail = getEmailFromToken(authHeader);
        BookingResponseDTO booking = bookingService.createBooking(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }

    // ==================== READ ====================

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable String id) {
        BookingResponseDTO booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponseDTO>> getUserBookings(
            @RequestHeader("Authorization") String authHeader) {
        String userEmail = getEmailFromToken(authHeader);
        List<BookingResponseDTO> bookings = bookingService.getUserBookings(userEmail);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/my-bookings/status/{status}")
    public ResponseEntity<List<BookingResponseDTO>> getUserBookingsByStatus(
            @PathVariable String status,
            @RequestHeader("Authorization") String authHeader) {
        String userEmail = getEmailFromToken(authHeader);
        BookingStatus bookingStatus = BookingStatus.valueOf(status.toUpperCase());
        List<BookingResponseDTO> bookings = bookingService.getUserBookingsByStatus(userEmail, bookingStatus);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDTO>> getAllBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String resourceId,
            @RequestParam(required = false) String userId) {
        List<BookingResponseDTO> bookings = bookingService.getAllBookings(status, resourceId, userId);
        return ResponseEntity.ok(bookings);
    }

    // ==================== UPDATE - Workflow ====================

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> approveBooking(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String adminEmail = getEmailFromToken(authHeader);
        BookingResponseDTO booking = bookingService.approveBooking(id, adminEmail);
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDTO> rejectBooking(
            @PathVariable String id,
            @Valid @RequestBody BookingActionRequestDTO request,
            @RequestHeader("Authorization") String authHeader) {
        String adminEmail = getEmailFromToken(authHeader);
        BookingResponseDTO booking = bookingService.rejectBooking(id, request.getReason(), adminEmail);
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userEmail = getEmailFromToken(authHeader);
        BookingResponseDTO booking = bookingService.cancelBooking(id, userEmail);
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> updateBooking(
            @PathVariable String id,
            @Valid @RequestBody BookingRequestDTO request,
            @RequestHeader("Authorization") String authHeader) {
        String userEmail = getEmailFromToken(authHeader);
        BookingResponseDTO booking = bookingService.updateBooking(id, request, userEmail);
        return ResponseEntity.ok(booking);
    }

    // ==================== DELETE ====================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(
            @PathVariable String id,
            @RequestHeader("Authorization") String authHeader) {
        String userEmail = getEmailFromToken(authHeader);
        bookingService.deleteBooking(id, userEmail);
        return ResponseEntity.ok("Booking deleted successfully");
    }

    // ==================== UTILITY ENDPOINTS ====================

    @GetMapping("/check-conflict")
    public ResponseEntity<Boolean> checkConflict(
            @RequestParam String resourceId,
            @RequestParam LocalDate date,
            @RequestParam LocalTime startTime,
            @RequestParam LocalTime endTime) {
        boolean hasConflict = bookingService.checkConflict(resourceId, date, startTime, endTime);
        return ResponseEntity.ok(hasConflict);
    }

    @GetMapping("/available-slots")
    public ResponseEntity<List<LocalTime[]>> getAvailableTimeSlots(
            @RequestParam String resourceId,
            @RequestParam LocalDate date) {
        List<LocalTime[]> availableSlots = bookingService.getAvailableTimeSlots(resourceId, date);
        return ResponseEntity.ok(availableSlots);
    }
}