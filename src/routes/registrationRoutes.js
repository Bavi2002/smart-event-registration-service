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
//import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post( createRegistration);
router.route('/my-bookings').get( getMyBookings);
router.route('/event/:eventId').get( getEventParticipants);
router.route('/:id').delete( cancelRegistration);
router.route('/health').get(healthCheck);

const limiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

router.route('/').post( limiter, validateBooking, createRegistration);

export default router;