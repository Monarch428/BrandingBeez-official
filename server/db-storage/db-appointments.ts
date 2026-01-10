// src/server/db-appointments.ts
import type { IStorage } from "../storage";
import type {
  Appointment,
  InsertAppointment,
  AppointmentStatus,
} from "@shared/schema";
import { AppointmentModel, GoogleAuthModel } from "../models";
import {
  ensureConnection,
  getNextSequence,
  toPlain,
} from "../helpers/db-helpers";

export const appointmentStorage = {
  async createAppointment(
    appointment: InsertAppointment,
  ): Promise<Appointment> {
    await ensureConnection();
    const id = await getNextSequence("appointments");
    const created = await AppointmentModel.create({
      id,
      status: "booked",
      event: "booking_success",
      ...appointment,
    });
    return toPlain<Appointment>(created);
  },

  async getAppointment(id: number): Promise<Appointment | undefined> {
    await ensureConnection();
    const appt = await AppointmentModel.findOne({ id }).lean<Appointment>();
    return appt ?? undefined;
  },

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    await ensureConnection();
    const appts = await AppointmentModel.find({ date })
      .sort({ startTime: 1 })
      .lean<Appointment[]>();
    return appts;
  },

  async getAllAppointments(): Promise<Appointment[]> {
    await ensureConnection();
    const appts = await AppointmentModel.find()
      .sort({ date: 1, startTime: 1 })
      .lean<Appointment[]>();
    return appts;
  },

  async getAppointmentsFiltered(params: {
    date?: string;
    fromDate?: string;
    toDate?: string;
    status?: AppointmentStatus;
    serviceType?: string;
    search?: string; // name / email / phone contains
  }): Promise<Appointment[]> {
    await ensureConnection();

    const { date, fromDate, toDate, status, serviceType, search } = params;
    const query: any = {};

    if (date) {
      query.date = date;
    } else if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = fromDate;
      if (toDate) query.date.$lte = toDate;
    }

    if (status) {
      query.status = status;
    }

    if (serviceType) {
      query.serviceType = { $regex: serviceType, $options: "i" };
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { notes: regex },
      ];
    }

    const appts = await AppointmentModel.find(query)
      .sort({ date: 1, startTime: 1 })
      .lean<Appointment[]>();

    return appts;
  },

  async updateAppointmentStatus(
    id: number,
    status: AppointmentStatus,
  ): Promise<Appointment> {
    await ensureConnection();
    const updated = await AppointmentModel.findOneAndUpdate(
      { id },
      { status },
      { new: true },
    ).lean<Appointment>();

    if (!updated) {
      throw new Error("Appointment not found");
    }
    return updated;
  },

  async deleteAppointment(id: number): Promise<Appointment | null> {
    await ensureConnection();

    const deleted = await AppointmentModel.findOneAndDelete({
      id,
    }).lean<Appointment>();

    return deleted ?? null;
  },

  async saveGoogleAuthTokens(tokens: {
    accessToken: string;
    refreshToken: string;
    expiryDate: number;
    email: string;
    calendarId?: string;
  }) {
    await ensureConnection();
    const existing = await GoogleAuthModel.findOne();

    if (existing) {
      existing.accessToken = tokens.accessToken;
      existing.refreshToken = tokens.refreshToken;
      existing.expiryDate = tokens.expiryDate;
      existing.email = tokens.email;
      if (tokens.calendarId) {
        existing.calendarId = tokens.calendarId;
      }
      await existing.save();
      return toPlain(existing);
    }

    const id = await getNextSequence("google_auth_tokens");
    const created = await GoogleAuthModel.create({ id, ...tokens });
    return toPlain(created);
  },

  async getGoogleAuthTokens() {
    await ensureConnection();
    const row = await GoogleAuthModel.findOne().lean();
    return row ?? null;
  },
} satisfies Pick<
  IStorage,
  | "createAppointment"
  | "getAppointment"
  | "getAppointmentsByDate"
  | "getAllAppointments"
  | "getAppointmentsFiltered"
  | "updateAppointmentStatus"
  | "deleteAppointment"
  | "saveGoogleAuthTokens"
  | "getGoogleAuthTokens"
>;
