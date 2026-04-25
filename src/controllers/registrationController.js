import Registration from "../models/Registration.js";
import { sendBookingConfirmation } from "../utils/notificationServiceClient.js";
import { checkEventAvailability, getEventDetails, updateEventCapacity } from "../utils/eventServiceClient.js";

export const createRegistration = async (req, res) => {
  try {
    const { eventId, ticketCount, notes } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "eventId is required" });
    }

    if (!Number.isInteger(ticketCount) || ticketCount < 1 || ticketCount > 10) {
      return res.status(400).json({
        message: "ticketCount must be integer 1–10",
      });
    }

    const token = req.headers.authorization?.split(" ")[1];

    // 1. Check availability from Event Service
    const { available } = await checkEventAvailability(eventId);
    console.log(`Event ${eventId} availability: ${available} spots left`);

    if (available < ticketCount) {
      return res.status(400).json({
        message: `Only ${available} spots remaining`,
      });
    }

    // 2. Get event details (for title)
    const event = await getEventDetails(eventId);
    console.log(`Event details for ${eventId}:`, event);

    // 3. Prevent double booking
    const existingBooking = await Registration.findOne({
      userEmail: req.user.email,
      eventId,
      status: "confirmed",
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "You already booked this event",
      });
    }
console.log("User:", req.user);
    // 4. Create registration
    const registration = await Registration.create({
      userEmail: req.user.email,
      eventId,
      eventTitle: event.title,
      ticketCount,
      notes: notes?.trim() || "",
      status: "confirmed",
      bookedAt: new Date(),
    });

    console.log(`Created registration ${registration._id} for user ${req.user.id} on event ${eventId}`);
    // 5. Send notification (non-blocking)
    await sendBookingConfirmation(registration, token);

    const newCapacity = available - ticketCount;
    console.log(`Updating event ${eventId} capacity to ${newCapacity}`);

    await updateEventCapacity(eventId, newCapacity, token);

    res.status(201).json({
      message: "Booking confirmed",
      registration,
      remainingSpots: newCapacity,
    });
  } catch (error) {
    console.error("Booking failed:", error);

    const status = error.message.includes("spots") ? 400 : 500;

    res.status(status).json({
      message: error.message || "Failed to create booking",
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Registration.find({ userEmail: req.user.email }).sort({
      bookedAt: -1,
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;

    // In real app you would check if requester is organizer
    // For assignment we allow anyone (you can add check later)

    const participants = await Registration.find({
      eventId,
      status: "confirmed",
    })
      .select("userEmail ticketCount bookedAt notes")
      .sort({ bookedAt: 1 });

    res.json(participants);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (registration.userEmail !== req.user.email) {
      return res
        .status(403)
        .json({ message: "You can only cancel your own bookings" });
    }

    registration.status = "cancelled";
    await registration.save();

    res.json({ message: "Booking cancelled", registration });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const healthCheck = (req, res) => {
  res.status(200).json({ status: "ok", service: "registration" });
};


