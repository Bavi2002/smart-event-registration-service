import axios from 'axios';

const NOTIF_BASE = process.env.NOTIFICATION_SERVICE_URL || 'http://127.0.0.1:3005/api/notifications';

export const sendBookingConfirmation = async (registration, token = null) => {
  try {
    const payload = {
      userEmail: registration.userEmail,
      eventId: registration.eventId,
      eventTitle: registration.eventTitle,
      ticketCount: registration.ticketCount,
      bookingId: registration._id.toString(),
      // totalPrice: 
    };

    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    await axios.post(
      `${NOTIF_BASE}/booking-confirmation`,
      payload,
      config
    );

  } catch (err) {
    console.error('[Notification] Failed:', err.message, err.response?.data);
  }
};