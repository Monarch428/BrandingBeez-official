// src/components/booking/AppointmentCalendar.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  fetchSlots,
  createAppointment,
  type DaySlot,
  type SlotStatus,
} from "@/lib/appointmentService";
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react";

interface AppointmentCalendarProps {
  defaultServiceType?: string;
  consultantName?: string;
  consultantTitle?: string;
  consultantImage?: string;
}

const statusClasses: Record<SlotStatus, string> = {
  available:
    "border border-emerald-500/60 text-emerald-50 bg-emerald-500/10 hover:bg-emerald-500/20",
  booked:
    "border border-amber-500/50 bg-amber-500/10 text-amber-100 cursor-not-allowed opacity-60",
  cancelled:
    "border border-slate-500/40 bg-slate-800/40 text-slate-200 line-through cursor-not-allowed",
  completed:
    "border border-blue-500/40 bg-blue-500/10 text-blue-100 cursor-not-allowed opacity-80",
};

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  defaultServiceType = "Web Development Consultation",
  consultantName = "Satheshkumar V",
  consultantTitle = "Digital Strategy & AI Consultant",
  consultantImage = "/images/team/sathesh-avatar.png", // adjust path
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [slots, setSlots] = useState<DaySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<DaySlot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [serviceType, setServiceType] = useState(defaultServiceType);

  const monthLabel = useMemo(() => {
    return currentMonth.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  }, [currentMonth]);

  const selectedDateKey = useMemo(() => {
    if (!selectedDate) return "";
    return selectedDate.toISOString().slice(0, 10); // YYYY-MM-DD
  }, [selectedDate]);

  // Days grid for current month
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstWeekday = firstDay.getDay(); // 0 = Sunday
    const totalDays = lastDay.getDate();

    const days: (Date | null)[] = [];
    const offset = (firstWeekday + 6) % 7; // shift to Monday = 0

    for (let i = 0; i < offset; i++) {
      days.push(null);
    }
    for (let d = 1; d <= totalDays; d++) {
      days.push(new Date(year, month, d));
    }

    return days;
  }, [currentMonth]);

  // Load slots when selectedDate changes
  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedDate) return;
      try {
        setLoadingSlots(true);
        setError(null);
        const res = await fetchSlots(selectedDateKey);
        setSlots(res.slots);
      } catch (err: any) {
        setError(err.message || "Failed to load slots");
      } finally {
        setLoadingSlots(false);
      }
    };
    if (selectedDateKey) {
      void loadSlots();
    }
  }, [selectedDateKey, selectedDate]);

  const goPrevMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const goNextMonth = () => {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot) {
      setError("Please select a date and time slot");
      return;
    }
    if (!name || !email) {
      setError("Name and email are required");
      return;
    }

    try {
      setBookingLoading(true);
      setError(null);
      setSuccess(null);

      await createAppointment({
        name,
        email,
        phone,
        notes,
        serviceType,
        date: selectedDateKey,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });

      setSuccess("Appointment booked successfully! 🎉");
      setSelectedSlot(null);

      // reload slots to mark as booked
      const res = await fetchSlots(selectedDateKey);
      setSlots(res.slots);
    } catch (err: any) {
      setError(err.message || "Failed to book appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const today = new Date();

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1.2fr)]">
      {/* Left: Calendar + slots */}
      <Card className="bg-slate-950/70 border-slate-800 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-slate-800">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-brand-coral">
              Book a strategy call
            </p>
            <CardTitle className="text-lg md:text-xl text-white mt-1">
              Pick a date & time that works for you
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="border-slate-700 bg-slate-900 hover:bg-slate-800"
              onClick={goPrevMonth}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-sm font-semibold text-slate-100 min-w-[120px] text-center">
              {monthLabel}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="border-slate-700 bg-slate-900 hover:bg-slate-800"
              onClick={goNextMonth}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6 space-y-6">
          {/* Calendar grid */}
          <div>
            <div className="grid grid-cols-7 text-xs md:text-[13px] text-center text-slate-400 mb-1">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {daysInMonth.map((date, idx) => {
                if (!date) {
                  return <div key={idx} className="h-9 md:h-10" />;
                }

                const isPast = date < new Date(today.toDateString());
                const isSelected =
                  selectedDate && isSameDay(date, selectedDate);

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isPast}
                    onClick={() => setSelectedDate(date)}
                    className={[
                      "h-9 md:h-10 rounded-lg text-xs md:text-sm flex items-center justify-center border transition-all",
                      isSelected
                        ? "bg-brand-coral text-white border-brand-coral shadow-sm"
                        : "border-slate-700 bg-slate-900/60 text-slate-100 hover:border-brand-coral/70 hover:bg-slate-900",
                      isPast ? "opacity-40 cursor-not-allowed" : "",
                    ].join(" ")}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots */}
          <div className="border-t border-slate-800 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <Clock className="w-4 h-4" />
                <span>
                  {selectedDate
                    ? selectedDate.toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })
                    : "Select a date"}
                </span>
              </div>
              <div className="flex gap-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm border border-emerald-500/70 bg-emerald-500/20" />
                  Available
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm border border-amber-500/70 bg-amber-500/20" />
                  Booked
                </span>
              </div>
            </div>

            {loadingSlots ? (
              <p className="text-xs text-slate-400">Loading slots…</p>
            ) : slots.length === 0 ? (
              <p className="text-xs text-slate-400">
                No slots defined for this day.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {slots.map((slot) => {
                  const disabled = slot.status !== "available";
                  const isSelected =
                    selectedSlot &&
                    selectedSlot.startTime === slot.startTime &&
                    selectedSlot.endTime === slot.endTime;
                  return (
                    <button
                      key={slot.startTime}
                      type="button"
                      disabled={disabled}
                      onClick={() =>
                        !disabled ? setSelectedSlot(slot) : undefined
                      }
                      className={[
                        "px-2 py-1.5 rounded-lg text-[11px] md:text-xs flex flex-col border transition-all",
                        statusClasses[slot.status],
                        isSelected
                          ? "ring-2 ring-brand-coral/80 ring-offset-2 ring-offset-slate-950"
                          : "",
                      ].join(" ")}
                    >
                      <span className="font-medium">
                        {slot.startTime}–{slot.endTime}
                      </span>
                      <span className="text-[10px] opacity-80 capitalize">
                        {slot.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error / success */}
          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-800/60 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded-md px-3 py-2">
              {success}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Right: Consultant card + form */}
      <Card className="bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950 border-slate-800 shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-brand-coral/20 border border-brand-coral/60 overflow-hidden flex items-center justify-center">
                {consultantImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={consultantImage}
                    alt={consultantName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-brand-coral" />
                )}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-brand-coral">
                30–45 min discovery call
              </p>
              <h3 className="text-sm md:text-base font-semibold text-white">
                {consultantName}
              </h3>
              <p className="text-[11px] text-slate-400">{consultantTitle}</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2.5 text-xs text-slate-300">
            On this call, we’ll review your goals, current website/ads setup,
            and map a simple 30–60 day plan. No pressure, no fluff.
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1.5">
              <label className="block text-slate-200">Full name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-slate-950 border-slate-700 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-200">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="bg-slate-950 border-slate-700 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-200">
                WhatsApp / phone (optional)
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91…"
                className="bg-slate-950 border-slate-700 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-200">
                What do you want to discuss?
              </label>
              <Input
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="bg-slate-950 border-slate-700 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-slate-200">
                Anything specific we should know?
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share your website, current challenges or goals…"
                className="bg-slate-950 border-slate-700 text-sm min-h-[80px]"
              />
            </div>
          </div>

          <Button
            type="button"
            disabled={bookingLoading}
            onClick={handleBook}
            className="w-full bg-brand-coral hover:bg-brand-coral/90 text-slate-950 font-semibold text-sm mt-2"
          >
            {bookingLoading
              ? "Booking your slot..."
              : "Confirm appointment & send details"}
          </Button>

          <p className="text-[11px] text-slate-500 text-center mt-1">
            You’ll receive a confirmation email with the meeting link & details
            after booking.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
