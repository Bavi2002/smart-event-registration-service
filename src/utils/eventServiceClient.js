import axios from "axios";

const EVENT_SERVICE_BASE =
  process.env.EVENT_SERVICE_URL || "http://127.0.0.1:3006/api/events";

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

    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const res = await axios.put(
      `${EVENT_SERVICE_BASE}/${eventId}`,
      { capacity: newCapacity },
      config,
    );
    return res.data;
  } catch (err) {
    console.error("Update event failed:", err.message);
    throw new Error("Failed to update event capacity");
  }
};
