import express from 'express';
import {
  createRegistration,
  getMyBookings,
  getEventParticipants,
  cancelRegistration,
  healthCheck
} from '../controllers/registrationController.js';
//import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').post( createRegistration);
router.route('/my-bookings').get( getMyBookings);
router.route('/event/:eventId').get( getEventParticipants);
router.route('/:id').delete( cancelRegistration);
router.route('/health').get(healthCheck);

export default router;