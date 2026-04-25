import express from 'express';
import {
  createRegistration,
  getMyBookings,
  getEventParticipants,
  cancelRegistration,
  healthCheck
} from '../controllers/registrationController.js';
import { validateBooking } from '../middleware/validate.js';
import rateLimit from 'express-rate-limit';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const limiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

// 🔐 Protected routes
router.route('/')
  .post(protect, limiter, validateBooking, createRegistration);

router.route('/my-bookings')
  .get(protect, getMyBookings);

router.route('/:id')
  .delete(protect, cancelRegistration);

// 🌐 Public routes
router.route('/event/:eventId')
  .get(getEventParticipants);

router.route('/health')
  .get(healthCheck);

export default router;