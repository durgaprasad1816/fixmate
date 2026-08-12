package com.fixmate.repository;

import com.fixmate.entity.Booking;
import com.fixmate.entity.BookingStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingStatusHistoryRepository extends JpaRepository<BookingStatusHistory, Long> {
    List<BookingStatusHistory> findByBookingOrderByTimestampAsc(Booking booking);
    void deleteByBooking(Booking booking);
}
