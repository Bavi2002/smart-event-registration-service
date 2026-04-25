// src/utils/eventServiceClient.js
import axios from "axios";

const EVENT_SERVICE_BASE =
  process.env.EVENT_SERVICE_URL/api/events || "http://localhost:3002/api/events";

// Call Event Service availability endpoint
export const checkEventAvailability = async (eventId) => {
  try {
    const res = await axios.get(
      `${EVENT_SERVICE_BASE}/${eventId}/availability`
    );

    return {
      available: res.data.remaining,
      capacity: res.data.capacity,
      eventId: res.data.eventId,
    };
  } catch (err) {
    console.error("Event Service error:", err.message);
    throw new Error("Failed to check event availability");
  }
};

// Optional: get event details
export const getEventDetails = async (eventId) => {
  try {
    const res = await axios.get(`${EVENT_SERVICE_BASE}/${eventId}`);
    return res.data;
  } catch (err) {
    throw new Error("Failed to fetch event details");
  }
};