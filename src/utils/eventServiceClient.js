// src/utils/eventServiceClient.js
import axios from 'axios';

const EVENT_BASE = process.env.EVENT_SERVICE_URL || 'http://localhost:3002/api';

export const checkEventAvailability = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Call Registration Service to count confirmed bookings
    const regRes = await axios.get(
      `${process.env.REGISTRATION_SERVICE_URL}/registrations/event/${event._id}`
    );

    const confirmedBookings = regRes.data.length; // assumes it returns array of registrations
    const available = event.capacity - confirmedBookings;

    res.json({
      available,
      capacity: event.capacity,
      eventTitle: event.title,
      eventId: event._id
    });
  } catch (err) {
    console.error("Failed to count bookings:", err.message);
    // Fallback: use placeholder
    res.json({
      available: event.capacity,
      capacity: event.capacity,
      eventTitle: event.title,
      eventId: event._id,
      note: "Using fallback count"
    });
  }
};

// Optional: full event details if needed later
export const getEventDetails = async (eventId, authToken = null) => {
  if (USE_MOCK) {
    return {
      _id: eventId,
      title: process.env.EVENT_MOCK_TITLE || 'Mock Event',
      description: 'This is mock data',
      date: new Date().toISOString()
    };
  }

  try {
    const config = authToken ? { headers: { Authorization: `Bearer ${authToken}` } } : {};
    const res = await axios.get(`${EVENT_SERVICE_BASE}/${eventId}`, config);
    return res.data;
  } catch (err) {
    throw new Error('Failed to fetch event details');
  }
};