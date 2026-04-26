
import { Schema, model } from 'mongoose';

const registrationSchema = new Schema({
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',           
//     required: true
//   },
  userEmail: {             
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  eventId: {
    type: String,         
    required: true
  },
  eventTitle: {           
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
    max: 10               
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

registrationSchema.index({ user: 1, eventId: 1 });
registrationSchema.index({ eventId: 1, status: 1 });

export default model('Registration', registrationSchema);