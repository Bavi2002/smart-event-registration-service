// src/utils/eventServiceClient.js
import axios from 'axios';

const EVENT_SERVICE_BASE = process.env.EVENT_SERVICE_URL || 'http://localhost:3002/api/events';

export const checkEventAvailability = async (eventId, requestedTickets = 1, authToken = null) => {
  if (process.env.USE_EVENT_MOCK) {
    console.log('[MOCK] Checking availability for event:', eventId);
    const available = process.env.EVENT_MOCK_CAPACITY || 20;
    if (available < requestedTickets) {
      throw new Error(`Only ${available} spots left (requested ${requestedTickets}) - mock mode`);
    }
    return {
      available,
      eventTitle: process.env.EVENT_MOCK_TITLE || 'Mock Event Title',
      currentBookings: 5, // fake
      capacity: 100
    };
  }


  try {
    const config = {};
    if (authToken) {
      config.headers = { Authorization: `Bearer ${authToken}` };
    }

    const res = await axios.get(`${EVENT_SERVICE_BASE}/${eventId}/availability`, config);

    const data = res.data;

    if (!data.available || data.available < requestedTickets) {
      throw new Error(
        `Insufficient spots: ${data.available || 0} available, requested ${requestedTickets}`
      );
    }

    return {
      available: data.available,
      eventTitle: data.eventTitle || 'Untitled Event',
      currentBookings: data.currentBookings || 0,
      capacity: data.capacity || 0
    };
  } catch (err) {
    console.error('Event Service call failed:', err.message);
    if (err.response) {
      throw new Error(err.response.data?.message || 'Event availability check failed');
    }
    throw new Error('Cannot reach Event Service – is it running?');
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