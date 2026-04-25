// src/utils/eventServiceClient.js
import axios from "axios";

const EVENT_SERVICE_BASE =
  process.env.EVENT_SERVICE_URL || "http://127.0.0.1:3006/api/events";

// Call Event Service availability endpoint
export const checkEventAvailability = async (eventId) => {
  try {
    const res = await axios.get(
      `${EVENT_SERVICE_BASE}/${eventId}/availability`,
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

export const updateEventCapacity = async (eventId, newCapacity, token) => {
  try {
    console.log(
      `Updating event ${eventId} capacity to ${newCapacity} with token ${token ? "provided" : "not provided"}`,
    );
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const res = await axios.put(
      `${EVENT_SERVICE_BASE}/${eventId}`,
      { capacity: newCapacity },
      config,
    );
    console.log(`Event ${eventId} capacity updated successfully:`, res.data);
    return res.data;
  } catch (err) {
    console.error("Update event failed:", err.message);
    throw new Error("Failed to update event capacity");
  }
};
