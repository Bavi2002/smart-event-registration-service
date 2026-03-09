import { body, validationResult } from 'express-validator';

export const validateBooking = [
  body('eventId').isString().trim().notEmpty(),
  body('ticketCount').isInt({ min: 1, max: 10 }),
  body('notes').optional().isString().trim().maxLength(500),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  }
];