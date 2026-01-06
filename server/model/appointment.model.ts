import mongoose, { Schema, type Model } from "mongoose";
import type { Appointment } from "@shared/schema";
import { numericIdField } from "../helpers/db-helpers";

const { model, models } = mongoose;

export interface AppointmentDocument extends mongoose.Document, Appointment {}

const appointmentSchema = new Schema<AppointmentDocument>(
  {
    id: numericIdField,

    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    serviceType: String,
    notes: String,

    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },

    meetingLink: { type: String },

    guestEmails: { type: [String], default: [] },

    bookedFromTimeZone: { type: String },
    bookedFromTimeZoneLabel: { type: String },

    status: {
      type: String,
      enum: ["booked", "cancelled", "completed"],
      default: "booked",
    },
  },
  {
    collection: "appointments",
    versionKey: false,
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

export const AppointmentModel =
  (models.Appointment as Model<AppointmentDocument>) ||
  model<AppointmentDocument>("Appointment", appointmentSchema);
