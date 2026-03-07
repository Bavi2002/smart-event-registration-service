// src/models/Registration.js

import { Schema, model } from 'mongoose';

const registrationSchema = new Schema({
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',           // reference – but we won't populate from other DB
//     required: true
//   },
  userEmail: {             // denormalized copy – faster & no cross-DB join
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  eventId: {
    type: String,          // we'll store Event Service's event _id as string
    required: true
  },
  eventTitle: {            // denormalized – snapshot at booking time
    type: String,
    required: true
  },
  bookedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'confirmed'
  },
  ticketCount: {
    type: Number,
    default: 1,
    min: 1,
    max: 10               // reasonable business limit
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Compound index – fast lookup for user's bookings & event participants
registrationSchema.index({ user: 1, eventId: 1 });
registrationSchema.index({ eventId: 1, status: 1 });

export default model('Registration', registrationSchema);