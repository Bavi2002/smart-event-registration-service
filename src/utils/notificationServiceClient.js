// src/utils/notificationServiceClient.js
import axios from 'axios';

const NOTIF_BASE = process.env.NOTIFICATION_SERVICE_URL/api/notifications || 'http://localhost:3004/api/notifications';

export const sendBookingConfirmation = async (registration, token = null) => {
  try {
    const payload = {
      userId: registration.user.toString(),
      userEmail: registration.userEmail,          // you already have it
      eventId: registration.eventId,
      eventTitle: registration.eventTitle,
      ticketCount: registration.ticketCount,
      bookingId: registration._id.toString(),
      // totalPrice: optional – add if you calculate it later
    };



    const res = await axios.post(
      `${NOTIF_BASE}/booking-confirmation`,
      payload
    );

    console.log('[Notification] Success:', res.data);
  } catch (err) {
    console.error('[Notification] Failed:', err.message, err.response?.data);
    // Non-blocking – do not throw
  }
};