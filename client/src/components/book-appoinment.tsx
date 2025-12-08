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
import { ChevronLeft, ChevronRight, Clock, User, X } from "lucide-react";
import RajeStroke from "@assets/Raje Stroke_1753273695213.png";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  timeZoneOptions,
  type TimeZoneOptionId,
  formatSlotLabelForTimeZone,
  getLocalMinutesFromISTSlot,
} from "@/utils/timezone-utils";
import { Checkbox } from "@/components/ui/checkbox";

// 🧩 Modal UI (shadcn dialog)
import {
  Dialog,
  DialogContent,
  DialogHeader as DialogHeaderUI,
  DialogTitle as DialogTitleUI,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AppointmentCalendarProps {
  defaultServiceType?: string;
  consultantName?: string;
  consultantTitle?: string;
  consultantImage?: string;
  /** Optional callback when you want to close outer modal after booking */
  onClose?: () => void;
}

// 🔹 SAME services as ContactFormOptimized
const services = [
  { value: "website-development", label: "Website Development" },
  { value: "seo", label: "SEO / AIO Services" },
  { value: "google-ads", label: "Google Ads" },
  { value: "dedicated-resources", label: "Dedicated Resources" },
  {
    value: "custom-app-development",
    label: "Custom Web & Mobile Application Development (AI-Powered)",
  },
];

// 🔵 Light theme slot styles (Calendly-like)
const statusClasses: Record<SlotStatus, string> = {
  available:
    "border border-emerald-400 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-500",
  booked:
    "border border-amber-400 bg-amber-50 text-amber-700 cursor-not-allowed opacity-70",
  cancelled:
    "border border-slate-300 bg-slate-100 text-slate-500 line-through cursor-not-allowed opacity-70",
  completed:
    "border border-blue-400 bg-blue-50 text-blue-700 cursor-not-allowed opacity-80",
};

// 🔵 Light inputs
const inputBase =
  "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:outline-none";

// 🔹 Helpers
const toLocalDateKey = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const parseTimeToMinutes = (time: string) => {
  const [hh, mm] = time.split(":").map(Number);
  return hh * 60 + mm;
};

type BookingStage = "date" | "time" | "form";
type StatusType = "success" | "error" | null;

const validateEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());
const validatePhone = (value: string) => value.trim().length >= 7;

export const AppointmentCalendarContent: React.FC<AppointmentCalendarProps> = ({
  defaultServiceType,
  consultantName,
  consultantTitle,
  consultantImage,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  // ✅ Start with NO date selected
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [slots, setSlots] = useState<DaySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<DaySlot | null>(null);

  // Slot-loading specific error
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Right-side status (success / error) that must show even after form is closed
  const [statusType, setStatusType] = useState<StatusType>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Stage flow: date → time → form
  const [bookingStage, setBookingStage] = useState<BookingStage>("date");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Guests (extra attendees)
  const [showGuestField, setShowGuestField] = useState(false);
  const [guestEmailsRaw, setGuestEmailsRaw] = useState("");

  // Field-level validation errors
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    phone?: string;
  }>({});

  // Form step inside right card (2 questions at a time)
  const [formStep, setFormStep] = useState<0 | 1 | 2>(0);

  // Service selection
  // mainServiceValue = the service from URL param (if present) and locked
  const [mainServiceValue, setMainServiceValue] = useState<string | null>(null);
  // selectedServiceValues = additional (and/or default) services user picks
  const [selectedServiceValues, setSelectedServiceValues] = useState<string[]>(
    [],
  );
  const [serviceLocked, setServiceLocked] = useState(false);

  // Timezone selection for display
  const [timeZone, setTimeZone] = useState<TimeZoneOptionId>("browser");

  const monthLabel = useMemo(() => {
    return currentMonth.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    });
  }, [currentMonth]);

  // ✅ Use local date key
  const selectedDateKey = useMemo(() => {
    if (!selectedDate) return "";
    return toLocalDateKey(selectedDate);
  }, [selectedDate]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const todayKey = toLocalDateKey(today);

  // Parse guests into a clean list for summary + backend
  const guestEmailsList = useMemo(
    () =>
      guestEmailsRaw
        .split(/[\n,;]/)
        .map((e) => e.trim())
        .filter((e) => e.length > 0),
    [guestEmailsRaw],
  );

  // Derive selected service labels (main + extra)
  const selectedServiceLabels = useMemo(() => {
    const labels: string[] = [];

    if (mainServiceValue) {
      const main = services.find((s) => s.value === mainServiceValue);
      if (main) labels.push(main.label);
    }

    services.forEach((s) => {
      if (selectedServiceValues.includes(s.value)) {
        if (!labels.includes(s.label)) {
          labels.push(s.label);
        }
      }
    });

    return labels;
  }, [mainServiceValue, selectedServiceValues]);

  const hasAnyService = selectedServiceLabels.length > 0;
  const combinedServiceType = selectedServiceLabels.join(", ");
  const mainServiceLabel =
    mainServiceValue &&
    services.find((s) => s.value === mainServiceValue)?.label;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const serviceFromUrl = params.get("service");

    // If service param is present in URL → treat as main/primary and lock it
    if (serviceFromUrl) {
      const match = services.find((s) => s.value === serviceFromUrl);
      if (match) {
        setMainServiceValue(match.value);
        setServiceLocked(true);
        return;
      }
    }

    // Else, if defaultServiceType prop passed → preselect it as normal selection
    if (defaultServiceType) {
      const match = services.find((s) => s.label === defaultServiceType);
      if (match) {
        setSelectedServiceValues([match.value]);
      }
    }
  }, [defaultServiceType]);

  // Days grid for current month
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstWeekday = firstDay.getDay(); // 0 (Sun) → 6 (Sat)
    const totalDays = lastDay.getDate();

    const days: (Date | null)[] = [];
    const offset = (firstWeekday + 6) % 7; // Monday-first index

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
      if (!selectedDateKey) return;

      try {
        setLoadingSlots(true);
        setSlotsError(null);
        const res = await fetchSlots(selectedDateKey);
        setSlots(res.slots);
      } catch (err: any) {
        setSlotsError(err.message || "Failed to load slots");
      } finally {
        setLoadingSlots(false);
      }
    };

    void loadSlots();
  }, [selectedDateKey]);

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

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setGuestEmailsRaw("");
    setShowGuestField(false);
    setFormStep(0);
    setFieldErrors({});
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedSlot) {
      setStatusType("error");
      setStatusMessage("Please select a date and time slot.");
      return;
    }
    if (!hasAnyService) {
      setStatusType("error");
      setStatusMessage("Please select at least one service.");
      return;
    }

    // Full validation for name, email, phone
    const errors: { name?: string; email?: string; phone?: string } = {};
    if (!name.trim()) {
      errors.name = "Name is required.";
    }
    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!validatePhone(phone)) {
      errors.phone = "Please enter a valid phone number.";
    }

    if (errors.name || errors.email || errors.phone) {
      setFieldErrors(errors);
      setStatusType("error");
      setStatusMessage("Please fix the highlighted fields before booking.");
      return;
    }

    try {
      setBookingLoading(true);
      setStatusType(null);
      setStatusMessage(null);

      const result = await createAppointment({
        name,
        email,
        phone,
        notes,
        // send combined service list as a single string
        serviceType: combinedServiceType,
        // also send structured guest emails (backend will handle invite)
        guestEmails: guestEmailsList,
        date: selectedDateKey,
        // 🔹 Times stay as IST strings on the backend
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });

      const meetText = result?.meetingLink
        ? ` Your Google Meet link: ${result.meetingLink}`
        : "";

      // ✅ Success message shown on right side even after form closes
      setStatusType("success");
      setStatusMessage(
        `🎉 Appointment confirmed...! Please check your email for the Google Meet link.`,
      );
      setTimeout(() => setStatusMessage(null), 6000);

      // Clear selection & form and go back to time view (form "closed")
      setSelectedSlot(null);
      setBookingStage("time");
      resetForm();

      // Optionally close the outer modal if provided
      if (onClose) {
        onClose();
      }

      // reload slots to mark booked
      const res = await fetchSlots(selectedDateKey);
      setSlots(res.slots);
    } catch (err: any) {
      setStatusType("error");
      setStatusMessage(
        err.message || "Failed to book appointment. Please try again.",
      );
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setBookingLoading(false);
    }
  };

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const canGoNextFromStep0 =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    validateEmail(email);

  const canGoNextFromStep1 =
    phone.trim().length > 0 && validatePhone(phone) && hasAnyService;

  // Format selected date for chips / labels
  const formattedSelectedDate =
    selectedDate &&
    selectedDate.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  // ✅ Only show right panel after slot selected (form) OR after a status exists
  const showRightPanel = bookingStage === "form" || !!statusType;

  // effective date when converting IST → target timezone
  const effectiveSelectedDate = selectedDate || today;

  // 🔹 Layout classes: center card when there is no right panel
  const layoutClass = showRightPanel
    ? "grid gap-6 lg:gap-10 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)]"
    : "flex justify-center";

  const safeConsultantName = consultantName || "Consultant name";
  const safeConsultantTitle = consultantTitle || "Consultant title";

  return (
    <div className={layoutClass}>
      {/* LEFT SECTION: Calendar or Time Slots */}
      <div className={showRightPanel ? "" : "w-full max-w-lg"}>
        <Card className="bg-white border-slate-200 shadow-md w-full">
          <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-slate-200">
            <div>
              <p className="text-[12px] uppercase tracking-[0.2em] text-blue-500 font-bold">
                Book a strategy call
              </p>
              <CardTitle className="text-lg md:text-xl text-slate-900 mt-1">
                {bookingStage === "date"
                  ? "Pick a date that works for you"
                  : "Pick a time slot"}
              </CardTitle>
            </div>

            {/* Month navigation only relevant while picking date */}
            {bookingStage === "date" && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                  onClick={goPrevMonth}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-sm font-semibold text-slate-900 min-w-[120px] text-center">
                  {monthLabel}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
                  onClick={goNextMonth}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* When date is picked, show chip + change button */}
            {bookingStage !== "date" && selectedDate && (
              <div className="flex flex-col items-end gap-1">
                <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[13px] text-blue-700 font-medium">
                  Selected date: {formattedSelectedDate}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setBookingStage("date");
                    setSelectedSlot(null);
                  }}
                  className="text-[12px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                >
                  <X className="w-3 h-3" />
                  Change date
                </button>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-3 md:p-4 space-y-6">
            {/* STEP 1: Calendar (stage = date) */}
            {bookingStage === "date" && (
              <div>
                <div className="grid grid-cols-7 text-[11px] md:text-[13px] text-center text-slate-500 mb-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (d) => (
                      <div key={d} className="py-1">
                        {d}
                      </div>
                    ),
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1 md:gap-2">
                  {daysInMonth.map((date, idx) => {
                    if (!date) {
                      return <div key={idx} className="h-9 md:h-10" />;
                    }

                    const day = new Date(date);
                    day.setHours(0, 0, 0, 0);

                    const isPastDay = day < today;

                    // 🚫 Block Saturday (6) & Sunday (0)
                    const isWeekend =
                      day.getDay() === 6 || day.getDay() === 0;

                    const isDisabled = isPastDay || isWeekend;

                    const isSelected =
                      !isDisabled &&
                      selectedDate &&
                      isSameDay(date, selectedDate);

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                          if (isDisabled) return;
                          setSelectedDate(date);
                          setSelectedSlot(null);
                          setBookingStage("time");
                        }}
                        className={[
                          "h-9 md:h-10 rounded-lg text-xs md:text-sm flex items-center justify-center border transition-all",
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-sm font-bold"
                            : isDisabled
                            ? "opacity-30 cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                            : "border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50 text-slate-700",
                        ].join(" ")}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Time slots (stage = time or form) */}
            {bookingStage !== "date" && (
              <div className="border-t border-slate-200 pt-4">
                <div className="flex items-center justify-between mb-3 gap-3">
                  <div className="flex flex-col gap-1 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span>
                        {selectedDate
                          ? selectedDate.toLocaleDateString("en-GB", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })
                          : "Select a date to see available times"}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Base availability:{" "}
                      <b>4:00 PM – 11:00 PM India time (IST)</b>. Times below
                      are shown in your selected timezone.
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1 text-[11px] text-slate-500">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] text-slate-600">
                        Showing times in:
                      </span>
                      <Select
                        value={timeZone}
                        onValueChange={(value) =>
                          setTimeZone(value as TimeZoneOptionId)
                        }
                      >
                        <SelectTrigger className="h-7 px-2 py-1 text-[10px] bg-white border-slate-300 text-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-slate-200 text-slate-800 text-[11px] max-h-72">
                          {timeZoneOptions.map((tz) => (
                            <SelectItem key={tz.id} value={tz.id}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 text-[10px] text-slate-600">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-sm border border-emerald-400 bg-emerald-100" />
                        Available
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded-sm border border-amber-400 bg-amber-100" />
                        Booked / Unavailable
                      </span>
                    </div>
                  </div>
                </div>

                {!selectedDate ? (
                  <p className="text-xs text-slate-500">
                    Choose a date on the calendar to view time slots.
                  </p>
                ) : loadingSlots ? (
                  <p className="text-xs text-slate-500">Loading slots…</p>
                ) : slotsError ? (
                  <p className="text-xs text-red-500">{slotsError}</p>
                ) : slots.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No slots defined for this day.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {slots.map((slot) => {
                      const now = new Date();
                      const nowMinutesLocal =
                        now.getHours() * 60 + now.getMinutes();

                      let isPastSlot = false;

                      if (selectedDateKey < todayKey) {
                        isPastSlot = true;
                      } else if (selectedDateKey === todayKey) {
                        // Compare using LOCAL browser time version of IST endTime
                        const endMinutesLocal = getLocalMinutesFromISTSlot(
                          slot.endTime,
                          effectiveSelectedDate,
                        );
                        if (endMinutesLocal <= nowMinutesLocal) {
                          isPastSlot = true;
                        }
                      }

                      const disabled =
                        slot.status !== "available" || isPastSlot;

                      const isSelected =
                        !disabled &&
                        selectedSlot &&
                        selectedSlot.startTime === slot.startTime &&
                        selectedSlot.endTime === slot.endTime;

                      const extraPastClasses = isPastSlot
                        ? "opacity-40 cursor-not-allowed !border-slate-200 !bg-slate-100"
                        : "";

                      // 🎯 Only show the START time (e.g., "04:00 PM")
                      const fullLabel = formatSlotLabelForTimeZone(
                        slot.startTime,
                        slot.endTime,
                        effectiveSelectedDate,
                        timeZone,
                      );
                      const [startLabelRaw] = fullLabel.split("–");
                      const startLabel = (startLabelRaw || fullLabel).trim();

                      return (
                        <button
                          key={slot.startTime}
                          type="button"
                          disabled={disabled}
                          onClick={() => {
                            if (disabled) return;
                            setSelectedSlot(slot);
                            setBookingStage("form");
                          }}
                          className={[
                            "px-2 py-1.5 rounded-lg text-[11px] md:text-xs flex flex-col border transition-all bg-white",
                            statusClasses[slot.status],
                            extraPastClasses,
                            isSelected
                              ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white"
                              : "",
                          ].join(" ")}
                        >
                          <span className="font-medium">{startLabel}</span>
                          <span className="text-[10px] opacity-85 capitalize">
                            {isPastSlot && slot.status === "available"
                              ? "unavailable"
                              : slot.status}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right: Consultant card + multi-step form + status*/}
      {showRightPanel && (
        <Card className="bg-white border-slate-200 shadow-md">
          <CardHeader className="pb-3 flex flex-row items-start justify-between gap-3 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-300 overflow-hidden flex items-center justify-center">
                  {consultantImage || RajeStroke ? (
                    <img
                      src={consultantImage || RajeStroke}
                      alt={safeConsultantName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-blue-500" />
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-blue-500 font-medium">
                  30–45 min discovery call
                </p>
                <h3 className="text-sm md:text-base font-semibold text-slate-900">
                  {safeConsultantName}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {safeConsultantTitle}
                </p>
              </div>
            </div>

            {/* Close form/back to time view */}
            {bookingStage === "form" && (
              <button
                type="button"
                onClick={() => {
                  setBookingStage("time");
                  setSelectedSlot(null);
                }}
                className="text-slate-500 hover:text-slate-800 transition-colors"
                aria-label="Close form"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </CardHeader>

          <CardContent className="space-y-4 p-4">
            <div className="mt-1 text-[11px] text-slate-700">
              <p>
                <b>Date:</b>{" "}
                {selectedSlot && formattedSelectedDate
                  ? formattedSelectedDate
                  : "Not selected yet"}
              </p>
              <p>
                <b>Time:</b>{" "}
                {selectedSlot
                  ? formatSlotLabelForTimeZone(
                      selectedSlot.startTime,
                      selectedSlot.endTime,
                      effectiveSelectedDate,
                      timeZone,
                    )
                  : "Pick a slot on the left"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-700">
              On this call, we’ll review your goals, current website/ads setup,
              and map a simple 30–60 day plan. No pressure, no fluff.
            </div>

            {/* ✅ Status message block (stays visible even when form is closed) */}
            {statusType && statusMessage && (
              <div
                className={[
                  "text-xs rounded-md border px-3 py-2",
                  statusType === "success"
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                    : "text-red-700 bg-red-50 border-red-200",
                ].join(" ")}
              >
                {statusMessage}
              </div>
            )}

            {bookingStage === "form" && selectedSlot ? (
              <>
                {/* Step indicator */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((step) => (
                      <div
                        key={step}
                        className={[
                          "h-1.5 rounded-full transition-all",
                          step === formStep
                            ? "w-6 bg-blue-600"
                            : "w-3 bg-slate-200",
                        ].join(" ")}
                      />
                    ))}
                  </div>
                  <span>Step {formStep + 1} of 3</span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* STEP 0: Name + Email + Guests */}
                  {formStep === 0 && (
                    <>
                      <div className="space-y-1.5">
                        <label className="block text-slate-900 text-[12px]">
                          Full name
                        </label>
                        <Input
                          value={name}
                          onChange={(e) => {
                            const value = e.target.value;
                            setName(value);
                            setFieldErrors((prev) => ({
                              ...prev,
                              name: value.trim() ? "" : prev.name,
                            }));
                          }}
                          onBlur={(e) => {
                            const value = e.target.value;
                            setFieldErrors((prev) => ({
                              ...prev,
                              name: value.trim()
                                ? ""
                                : "Name is required.",
                            }));
                          }}
                          placeholder="Your name"
                          className={inputBase}
                        />
                        {fieldErrors.name && (
                          <p className="text-[11px] text-red-500 mt-0.5">
                            {fieldErrors.name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-slate-900 text-[12px]">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            const value = e.target.value;
                            setEmail(value);
                            setFieldErrors((prev) => {
                              if (!value.trim()) {
                                return {
                                  ...prev,
                                  email: "Email is required.",
                                };
                              }
                              if (!validateEmail(value)) {
                                return {
                                  ...prev,
                                  email:
                                    "Please enter a valid email address.",
                                };
                              }
                              return { ...prev, email: "" };
                            });
                          }}
                          onBlur={(e) => {
                            const value = e.target.value;
                            setFieldErrors((prev) => {
                              if (!value.trim()) {
                                return {
                                  ...prev,
                                  email: "Email is required.",
                                };
                              }
                              if (!validateEmail(value)) {
                                return {
                                  ...prev,
                                  email:
                                    "Please enter a valid email address.",
                                };
                              }
                              return { ...prev, email: "" };
                            });
                          }}
                          placeholder="you@company.com"
                          className={inputBase}
                        />
                        {fieldErrors.email && (
                          <p className="text-[11px] text-red-500 mt-0.5">
                            {fieldErrors.email}
                          </p>
                        )}
                      </div>

                      {/* Add guests (optional) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-slate-900 text-[12px]">
                            Add guests (optional)
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              setShowGuestField((prev) => !prev)
                            }
                            className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
                          >
                            {showGuestField ? "Hide guests" : "Add guests"}
                          </button>
                        </div>
                        {showGuestField && (
                          <>
                            <Textarea
                              value={guestEmailsRaw}
                              onChange={(e) =>
                                setGuestEmailsRaw(e.target.value)
                              }
                              placeholder={
                                "guest1@company.com, guest2@company.com\nor one email per line"
                              }
                              className={`${inputBase} min-h-[70px] text-xs`}
                            />
                            <p className="text-[10px] text-slate-500">
                              We'll send the meeting invite to these guest email
                              addresses as well.
                            </p>
                          </>
                        )}
                      </div>
                    </>
                  )}

                  {/* STEP 1: Phone + Multi-service selection */}
                  {formStep === 1 && (
                    <>
                      <div className="space-y-1.5">
                        <label className="block text-slate-900 text-[12px]">
                          WhatsApp / phone
                        </label>
                        <Input
                          value={phone}
                          onChange={(e) => {
                            const value = e.target.value;
                            setPhone(value);
                            setFieldErrors((prev) => {
                              if (!value.trim()) {
                                return {
                                  ...prev,
                                  phone: "Phone number is required.",
                                };
                              }
                              if (!validatePhone(value)) {
                                return {
                                  ...prev,
                                  phone:
                                    "Please enter a valid phone number.",
                                };
                              }
                              return { ...prev, phone: "" };
                            });
                          }}
                          onBlur={(e) => {
                            const value = e.target.value;
                            setFieldErrors((prev) => {
                              if (!value.trim()) {
                                return {
                                  ...prev,
                                  phone: "Phone number is required.",
                                };
                              }
                              if (!validatePhone(value)) {
                                return {
                                  ...prev,
                                  phone:
                                    "Please enter a valid phone number.",
                                };
                              }
                              return { ...prev, phone: "" };
                            });
                          }}
                          placeholder="+91…"
                          className={inputBase}
                        />
                        {fieldErrors.phone && (
                          <p className="text-[11px] text-red-500 mt-0.5">
                            {fieldErrors.phone}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-slate-900 text-[12px]">
                          What do you want to discuss?
                        </label>
                        <p className="text-[11px] text-slate-500 mb-1">
                          You can pick more than one service.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {services.map((service) => {
                            const isMain =
                              serviceLocked &&
                              service.value === mainServiceValue;
                            const isChecked =
                              isMain ||
                              selectedServiceValues.includes(service.value);

                            return (
                              <button
                                key={service.value}
                                type="button"
                                onClick={() => {
                                  if (isMain) return;
                                  setSelectedServiceValues((prev) =>
                                    isChecked
                                      ? prev.filter(
                                          (v) => v !== service.value,
                                        )
                                      : [...prev, service.value],
                                  );
                                }}
                                className={[
                                  "flex items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-left text-[11px] transition-all",
                                  isChecked
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/60",
                                  isMain
                                    ? "cursor-not-allowed opacity-85"
                                    : "cursor-pointer",
                                ].join(" ")}
                              >
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={isChecked}
                                    disabled={isMain}
                                    onCheckedChange={(checked) => {
                                      if (isMain) return;
                                      setSelectedServiceValues((prev) =>
                                        checked
                                          ? [...prev, service.value]
                                          : prev.filter(
                                              (v) => v !== service.value,
                                            ),
                                      );
                                    }}
                                  />
                                  <span className="text-slate-800 text-[11px]">
                                    {service.label}
                                    {isMain && (
                                      <span className="ml-1 text-[10px] text-blue-600 font-medium">
                                        (Main)
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {serviceLocked && mainServiceLabel && (
                          <p className="text-[10px] text-slate-500 mt-1">
                            Main service pre-selected from the service page (
                            {mainServiceLabel}). You can add more services
                            above.
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* STEP 2: Notes + Summary */}
                  {formStep === 2 && (
                    <>
                      <div className="space-y-1.5">
                        <label className="block text-slate-900 text-[12px]">
                          Anything specific we should know?
                        </label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Share your website, current challenges or goals…"
                          className={`${inputBase} min-h-[90px] text-xs`}
                        />
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
                        <p className="font-semibold mb-1 text-slate-900">
                          Quick summary
                        </p>
                        <p>
                          <b>Name:</b> {name || "—"}
                        </p>
                        <p>
                          <b>Email:</b> {email || "—"}
                        </p>
                        <p>
                          <b>Service(s):</b>{" "}
                          {combinedServiceType || "Not selected"}
                        </p>
                        <p>
                          <b>Date:</b> {formattedSelectedDate || "Not selected"}
                        </p>
                        <p>
                          <b>Time:</b>{" "}
                          {selectedSlot
                            ? formatSlotLabelForTimeZone(
                                selectedSlot.startTime,
                                selectedSlot.endTime,
                                effectiveSelectedDate,
                                timeZone,
                              )
                            : "Not selected"}
                        </p>
                        {guestEmailsList.length > 0 && (
                          <p>
                            <b>Guests:</b> {guestEmailsList.join(", ")}
                          </p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Step navigation buttons */}
                <div
                  className={`flex items-center pt-1 ${
                    formStep === 0 ? "justify-end" : "justify-between"
                  }`}
                >
                  {/* Show Back button only after moving past the first step */}
                  {formStep > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setFormStep((prev) =>
                          prev > 0 ? ((prev - 1) as 0 | 1 | 2) : prev,
                        )
                      }
                      className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    >
                      Back
                    </Button>
                  )}

                  {formStep < 2 ? (
                    <Button
                      type="button"
                      size="sm"
                      disabled={
                        (formStep === 0 && !canGoNextFromStep0) ||
                        (formStep === 1 && !canGoNextFromStep1)
                      }
                      onClick={() =>
                        setFormStep((prev) =>
                          prev < 2 ? ((prev + 1) as 0 | 1 | 2) : prev,
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="sm"
                      disabled={bookingLoading}
                      onClick={handleBook}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4"
                    >
                      {bookingLoading
                        ? "Booking your slot..."
                        : "Confirm appointment & send details"}
                    </Button>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 text-center mt-1">
                  You’ll receive a confirmation email with the meeting link
                  &amp; details after booking.
                </p>
              </>
            ) : (
              // When form is "closed" but panel is visible due to status
              <div className="text-[11px] text-slate-500 mt-2">
                {selectedSlot
                  ? "Fill the form to confirm your slot."
                  : "Select a date and time on the left to open the booking form."}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

/**
 * 🧩 Modal wrapper: use this if you already manage open state.
 */
interface AppointmentCalendarModalProps extends AppointmentCalendarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AppointmentCalendarModal: React.FC<
  AppointmentCalendarModalProps
> = ({ open, onOpenChange, ...calendarProps }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full p-0 gap-0">
        <DialogHeaderUI className="px-4 pt-4 pb-2 border-b border-slate-200">
          <DialogTitleUI className="text-base md:text-lg font-semibold">
            Book a strategy call
          </DialogTitleUI>
          <DialogDescription className="text-xs md:text-sm text-slate-500">
            Pick a suitable date & time and share a few details so we can
            prepare for the call.
          </DialogDescription>
        </DialogHeaderUI>

        <div className="p-3 md:p-4">
          <AppointmentCalendarContent
            {...calendarProps}
            onClose={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

/**
 * 🔘 Convenience component:
 *  - Renders a “Book a call” button
 *  - Opens the appointment modal on click
 *
 * Use this anywhere you have a CTA.
 */
interface BookCallButtonWithModalProps extends AppointmentCalendarProps {
  buttonLabel?: string;
  /** Prefer this or className for styling the trigger button */
  buttonClassName?: string;
  /** Alias for buttonClassName so usage feels like a normal Button */
  className?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
}

export const BookCallButtonWithModal: React.FC<
  BookCallButtonWithModalProps
> = ({
  buttonLabel,
  buttonClassName,
  className,
  buttonVariant,
  buttonSize,
  ...calendarProps
}) => {
  const [open, setOpen] = useState(false);

  const mergedClassName = [buttonClassName, className]
    .filter(Boolean)
    .join(" ");

  const labelToUse = buttonLabel || "Book a call"; // placeholder if not provided
  const variantToUse: "default" | "outline" | "secondary" | "ghost" | "link" =
    buttonVariant || "default";
  const sizeToUse: "default" | "sm" | "lg" | "icon" = buttonSize || "default";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={variantToUse}
          size={sizeToUse}
          className={mergedClassName}
        >
          {labelToUse}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl w-full p-0 gap-0">
        <DialogHeaderUI className="px-4 pt-4 pb-2 border-b border-slate-200">
          <DialogTitleUI className="text-base md:text-xl uppercase font-bold text-brand-coral">
            Book a strategy call
          </DialogTitleUI>
          <DialogDescription className="text-xs md:text-sm text-slate-500">
            Choose a time that works for you. You’ll get a Google Meet invite
            via email after booking.
          </DialogDescription>
        </DialogHeaderUI>

        <div className="p-3 md:p-4">
          <AppointmentCalendarContent
            {...calendarProps}
            onClose={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Keep old name for inline use
export const AppointmentCalendar = AppointmentCalendarContent;
export default AppointmentCalendarContent;





//-----------------------------------------------------------------------------------------------------  //

// // src/components/booking/AppointmentCalendar.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   fetchSlots,
//   createAppointment,
//   type DaySlot,
//   type SlotStatus,
// } from "@/lib/appointmentService";
// import { ChevronLeft, ChevronRight, Clock, User, X } from "lucide-react";
// import RajeStroke from "@assets/Raje Stroke_1753273695213.png";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   timeZoneOptions,
//   type TimeZoneOptionId,
//   formatSlotLabelForTimeZone,
//   getLocalMinutesFromISTSlot,
// } from "@/utils/timezone-utils";

// interface AppointmentCalendarProps {
//   defaultServiceType?: string;
//   consultantName?: string;
//   consultantTitle?: string;
//   consultantImage?: string;
// }

// // 🔹 SAME services as ContactFormOptimized
// const services = [
//   { value: "website-development", label: "Website Development" },
//   { value: "seo", label: "SEO / AIO Services" },
//   { value: "google-ads", label: "Google Ads" },
//   { value: "dedicated-resources", label: "Dedicated Resources" },
//   {
//     value: "custom-app-development",
//     label: "Custom Web & Mobile Application Development (AI-Powered)",
//   },
// ];

// const statusClasses: Record<SlotStatus, string> = {
//   available:
//     "border border-emerald-400/70 text-emerald-100 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-300",
//   booked:
//     "border border-amber-500/60 bg-amber-500/10 text-amber-100 cursor-not-allowed opacity-70",
//   cancelled:
//     "border border-slate-600/70 bg-slate-900/60 text-slate-300 line-through cursor-not-allowed opacity-70",
//   completed:
//     "border border-blue-500/60 bg-blue-500/10 text-blue-100 cursor-not-allowed opacity-80",
// };

// const inputBase =
//   "bg-slate-900/70 border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm focus-visible:ring-1 focus-visible:ring-brand-coral focus-visible:border-brand-coral/80 focus-visible:outline-none";

// // 🔹 Helpers
// const toLocalDateKey = (date: Date) => {
//   const y = date.getFullYear();
//   const m = String(date.getMonth() + 1).padStart(2, "0");
//   const d = String(date.getDate()).padStart(2, "0");
//   return `${y}-${m}-${d}`;
// };

// const parseTimeToMinutes = (time: string) => {
//   const [hh, mm] = time.split(":").map(Number);
//   return hh * 60 + mm;
// };

// type BookingStage = "date" | "time" | "form";
// type StatusType = "success" | "error" | null;

// const validateEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());

// const validatePhone = (value: string) => value.trim().length >= 7;

// export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
//   defaultServiceType = "Website Development",
//   consultantName = "Raja Rajeshwari",
//   consultantTitle = "Digital Strategy & AI Consultant",
//   // consultantImage = {RajeStroke}
// }) => {
//   const [currentMonth, setCurrentMonth] = useState(() => new Date());

//   // ✅ Start with NO date selected
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);

//   const [slots, setSlots] = useState<DaySlot[]>([]);
//   const [loadingSlots, setLoadingSlots] = useState(false);
//   const [bookingLoading, setBookingLoading] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState<DaySlot | null>(null);

//   // Slot-loading specific error
//   const [slotsError, setSlotsError] = useState<string | null>(null);

//   // Right-side status (success / error) that must show even after form is closed
//   const [statusType, setStatusType] = useState<StatusType>(null);
//   const [statusMessage, setStatusMessage] = useState<string | null>(null);

//   // Stage flow: date → time → form
//   const [bookingStage, setBookingStage] = useState<BookingStage>("date");

//   // Form state
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [notes, setNotes] = useState("");

//   // Field-level validation errors
//   const [fieldErrors, setFieldErrors] = useState<{
//     name?: string;
//     email?: string;
//     phone?: string;
//   }>({});

//   // Form step inside right card (2 questions at a time)
//   const [formStep, setFormStep] = useState<0 | 1 | 2>(0);

//   // Service selection (same semantics as contact form)
//   const [serviceValue, setServiceValue] = useState<string>("");
//   const [serviceType, setServiceType] = useState<string>(defaultServiceType);
//   const [serviceLocked, setServiceLocked] = useState(false);

//   // Timezone selection for display
//   const [timeZone, setTimeZone] = useState<TimeZoneOptionId>("browser");

//   const monthLabel = useMemo(() => {
//     return currentMonth.toLocaleDateString("en-GB", {
//       month: "long",
//       year: "numeric",
//     });
//   }, [currentMonth]);

//   // ✅ Use local date key
//   const selectedDateKey = useMemo(() => {
//     if (!selectedDate) return "";
//     return toLocalDateKey(selectedDate);
//   }, [selectedDate]);

//   const today = useMemo(() => {
//     const d = new Date();
//     d.setHours(0, 0, 0, 0);
//     return d;
//   }, []);

//   const todayKey = toLocalDateKey(today);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const params = new URLSearchParams(window.location.search);
//     const serviceFromUrl = params.get("service");

//     if (serviceFromUrl) {
//       const match = services.find((s) => s.value === serviceFromUrl);
//       if (match) {
//         setServiceValue(match.value);
//         setServiceType(match.label);
//         setServiceLocked(true);
//         return;
//       }
//     }

//     if (defaultServiceType) {
//       const match = services.find((s) => s.label === defaultServiceType);
//       if (match) {
//         setServiceValue(match.value);
//         setServiceType(match.label);
//       }
//     }
//   }, [defaultServiceType]);

//   // Keep serviceType label in sync when manual selection changes
//   useEffect(() => {
//     if (!serviceValue) return;
//     const match = services.find((s) => s.value === serviceValue);
//     if (match) {
//       setServiceType(match.label);
//     }
//   }, [serviceValue]);

//   // Days grid for current month
//   const daysInMonth = useMemo(() => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();

//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const firstWeekday = firstDay.getDay(); // 0 = Sunday
//     const totalDays = lastDay.getDate();

//     const days: (Date | null)[] = [];
//     const offset = (firstWeekday + 6) % 7; // shift to Monday = 0

//     for (let i = 0; i < offset; i++) {
//       days.push(null);
//     }
//     for (let d = 1; d <= totalDays; d++) {
//       days.push(new Date(year, month, d));
//     }

//     return days;
//   }, [currentMonth]);

//   // Load slots when selectedDate changes
//   useEffect(() => {
//     const loadSlots = async () => {
//       if (!selectedDateKey) return;

//       try {
//         setLoadingSlots(true);
//         setSlotsError(null);
//         const res = await fetchSlots(selectedDateKey);
//         setSlots(res.slots);
//       } catch (err: any) {
//         setSlotsError(err.message || "Failed to load slots");
//       } finally {
//         setLoadingSlots(false);
//       }
//     };

//     void loadSlots();
//   }, [selectedDateKey]);

//   const goPrevMonth = () => {
//     setCurrentMonth(
//       (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
//     );
//   };

//   const goNextMonth = () => {
//     setCurrentMonth(
//       (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
//     );
//   };

//   const resetForm = () => {
//     setName("");
//     setEmail("");
//     setPhone("");
//     setNotes("");
//     setFormStep(0);
//     setFieldErrors({});
//   };

//   const handleBook = async () => {
//     if (!selectedDate || !selectedSlot) {
//       setStatusType("error");
//       setStatusMessage("Please select a date and time slot.");
//       return;
//     }
//     if (!serviceType) {
//       setStatusType("error");
//       setStatusMessage("Please select what you want to discuss.");
//       return;
//     }

//     // Full validation for name, email, phone
//     const errors: { name?: string; email?: string; phone?: string } = {};
//     if (!name.trim()) {
//       errors.name = "Name is required.";
//     }
//     if (!email.trim()) {
//       errors.email = "Email is required.";
//     } else if (!validateEmail(email)) {
//       errors.email = "Please enter a valid email address.";
//     }
//     if (!phone.trim()) {
//       errors.phone = "Phone number is required.";
//     } else if (!validatePhone(phone)) {
//       errors.phone = "Please enter a valid phone number.";
//     }

//     if (errors.name || errors.email || errors.phone) {
//       setFieldErrors(errors);
//       setStatusType("error");
//       setStatusMessage("Please fix the highlighted fields before booking.");
//       return;
//     }

//     try {
//       setBookingLoading(true);
//       setStatusType(null);
//       setStatusMessage(null);

//       const result = await createAppointment({
//         name,
//         email,
//         phone,
//         notes,
//         serviceType,
//         date: selectedDateKey,
//         // 🔹 Times stay as IST strings on the backend
//         startTime: selectedSlot.startTime,
//         endTime: selectedSlot.endTime,
//       });

//       const meetText = result?.meetingLink
//         ? ` Your Google Meet link: ${result.meetingLink}`
//         : "";

//       // ✅ Success message shown on right side even after form closes
//       setStatusType("success");
//       // setStatusMessage(`Appointment booked successfully! 🎉${meetText}`);
//       setStatusMessage(
//         `🎉 Appointment confirmed...! Please check your email for the Google Meet link.`,
//       );
//       setTimeout(() => setStatusMessage(null), 6000);

//       // Clear selection & form and go back to time view (form "closed")
//       setSelectedSlot(null);
//       setBookingStage("time");
//       resetForm();

//       // reload slots to mark booked
//       const res = await fetchSlots(selectedDateKey);
//       setSlots(res.slots);
//     } catch (err: any) {
//       setStatusType("error");
//       setStatusMessage(
//         err.message || "Failed to book appointment. Please try again.",
//       );
//       setTimeout(() => setStatusMessage(null), 4000);
//     } finally {
//       setBookingLoading(false);
//     }
//   };

//   const isSameDay = (d1: Date, d2: Date) =>
//     d1.getFullYear() === d2.getFullYear() &&
//     d1.getMonth() === d2.getMonth() &&
//     d1.getDate() === d2.getDate();

//   const canGoNextFromStep0 =
//     name.trim().length > 0 &&
//     email.trim().length > 0 &&
//     validateEmail(email);

//   const canGoNextFromStep1 =
//     phone.trim().length > 0 && validatePhone(phone) && !!serviceType;

//   // Format selected date for chips / labels
//   const formattedSelectedDate =
//     selectedDate &&
//     selectedDate.toLocaleDateString("en-GB", {
//       weekday: "short",
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });

//   // ✅ Only show right panel after slot selected (form) OR after a status exists
//   const showRightPanel = bookingStage === "form" || !!statusType;

//   // effective date when converting IST → target timezone
//   const effectiveSelectedDate = selectedDate || today;

//   // 🔹 Layout classes: center card when there is no right panel
//   const layoutClass = showRightPanel
//     ? "grid gap-12 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)]"
//     : "flex justify-center";

//   return (
//     <div className={layoutClass}>
//       {/* LEFT SECTION: Calendar or Time Slots */}
//       <div className={showRightPanel ? "" : "w-full max-w-2xl"}>
//         <Card className="bg-slate-950/80 border-slate-800 shadow-xl w-full">
//           <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-slate-800">
//             <div>
//               <p className="text-[14px] uppercase tracking-[0.2em] text-brand-coral font-bold">
//                 Book a strategy call
//               </p>
//               <CardTitle className="text-lg md:text-xl text-slate-50 mt-1">
//                 {bookingStage === "date"
//                   ? "Pick a date that works for you"
//                   : "Pick a time slot"}
//               </CardTitle>
//             </div>

//             {/* Month navigation only relevant while picking date */}
//             {bookingStage === "date" && (
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-100"
//                   onClick={goPrevMonth}
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </Button>
//                 <div className="text-sm font-semibold text-slate-100 min-w-[120px] text-center">
//                   {monthLabel}
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-100"
//                   onClick={goNextMonth}
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </Button>
//               </div>
//             )}

//             {/* When date is picked, show chip + change button */}
//             {bookingStage !== "date" && selectedDate && (
//               <div className="flex flex-col items-end gap-1">
//                 <span className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-700 text-[14px] text-slate-200">
//                   Selected date: {formattedSelectedDate}
//                 </span>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setBookingStage("date");
//                     setSelectedSlot(null);
//                   }}
//                   className="text-[12px] text-slate-400 hover:text-slate-100 flex items-center gap-1"
//                 >
//                   <X className="w-3 h-3" />
//                   Change date
//                 </button>
//               </div>
//             )}
//           </CardHeader>

//           <CardContent className="p-2 md:p-2 space-y-6">
//             {/* STEP 1: Calendar (stage = date) */}
//             {bookingStage === "date" && (
//               <div>
//                 <div className="grid grid-cols-7 text-[11px] md:text-[13px] text-center text-slate-400 mb-1">
//                   {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
//                     (d) => (
//                       <div key={d} className="py-1">
//                         {d}
//                       </div>
//                     ),
//                   )}
//                 </div>
//                 <div className="grid grid-cols-7 gap-1 md:gap-2">
//                   {daysInMonth.map((date, idx) => {
//                     if (!date) {
//                       return <div key={idx} className="h-9 md:h-10" />;
//                     }

//                     const day = new Date(date);
//                     day.setHours(0, 0, 0, 0);
//                     const isPastDay = day < today;
//                     const isSelected =
//                       selectedDate && isSameDay(date, selectedDate);

//                     return (
//                       <button
//                         key={idx}
//                         type="button"
//                         disabled={isPastDay}
//                         onClick={() => {
//                           setSelectedDate(date);
//                           setSelectedSlot(null);
//                           setBookingStage("time");
//                         }}
//                         className={[
//                           "h-9 md:h-10 rounded-lg text-xs md:text-sm flex items-center justify-center border transition-all text-slate-100",
//                           isSelected
//                             ? "bg-brand-coral text-slate-950 border-brand-coral shadow-sm font-bold"
//                             : "border-slate-700 bg-slate-900/70 hover:border-brand-coral/70 hover:bg-slate-900",
//                           isPastDay ? "opacity-20 cursor-not-allowed" : "",
//                         ].join(" ")}
//                       >
//                         {date.getDate()}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* STEP 2: Time slots (stage = time or form) */}
//             {bookingStage !== "date" && (
//               <div className="border-t border-slate-800 pt-4">
//                 <div className="flex items-center justify-between mb-3 gap-3">
//                   <div className="flex flex-col gap-0.5 text-xs text-slate-300">
//                     <div className="flex items-center gap-2">
//                       <Clock className="w-4 h-4" />
//                       <span>
//                         {selectedDate
//                           ? selectedDate.toLocaleDateString("en-GB", {
//                             weekday: "short",
//                             day: "numeric",
//                             month: "short",
//                           })
//                           : "Select a date to see available times"}
//                       </span>
//                     </div>
//                     <span className="text-[11px] text-orange-600">
//                       Base availability:{" "}
//                       <b>4:00 PM – 11:00 PM India time (IST)</b>. Times below
//                       are shown in your selected timezone.
//                     </span>
//                   </div>

//                   <div className="flex flex-col items-end gap-1 text-[11px] text-slate-400">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="text-[10px] text-white">
//                         Showing times in:
//                       </span>
//                       <Select
//                         value={timeZone}
//                         onValueChange={(value) =>
//                           setTimeZone(value as TimeZoneOptionId)
//                         }
//                       >
//                         <SelectTrigger className="h-7 px-2 py-1 text-[10px] bg-slate-900 border-slate-700 text-slate-100">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent className="bg-slate-900 border-slate-700 text-slate-100 text-[11px] max-h-72">
//                           {timeZoneOptions.map((tz) => (
//                             <SelectItem key={tz.id} value={tz.id}>
//                               {tz.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="flex gap-2">
//                       <span className="flex items-center gap-1">
//                         <span className="w-3 h-3 rounded-sm border border-emerald-400/80 bg-emerald-500/30" />
//                         Available
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <span className="w-3 h-3 rounded-sm border border-amber-500/80 bg-amber-500/30" />
//                         Booked / Unavailable
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {!selectedDate ? (
//                   <p className="text-xs text-slate-400">
//                     Choose a date on the calendar to view time slots.
//                   </p>
//                 ) : loadingSlots ? (
//                   <p className="text-xs text-slate-400">Loading slots…</p>
//                 ) : slotsError ? (
//                   <p className="text-xs text-red-400">{slotsError}</p>
//                 ) : slots.length === 0 ? (
//                   <p className="text-xs text-slate-400">
//                     No slots defined for this day.
//                   </p>
//                 ) : (
//                   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
//                     {slots.map((slot) => {
//                       const now = new Date();
//                       const nowMinutesLocal =
//                         now.getHours() * 60 + now.getMinutes();

//                       let isPastSlot = false;

//                       if (selectedDateKey < todayKey) {
//                         isPastSlot = true;
//                       } else if (selectedDateKey === todayKey) {
//                         // Compare using LOCAL browser time version of IST endTime
//                         const endMinutesLocal = getLocalMinutesFromISTSlot(
//                           slot.endTime,
//                           effectiveSelectedDate,
//                         );
//                         if (endMinutesLocal <= nowMinutesLocal) {
//                           isPastSlot = true;
//                         }
//                       }

//                       const disabled =
//                         slot.status !== "available" || isPastSlot;

//                       const isSelected =
//                         !disabled &&
//                         selectedSlot &&
//                         selectedSlot.startTime === slot.startTime &&
//                         selectedSlot.endTime === slot.endTime;

//                       const extraPastClasses = isPastSlot
//                         ? "opacity-40 cursor-not-allowed !border-slate-700 !bg-slate-900/60"
//                         : "";

//                       return (
//                         <button
//                           key={slot.startTime}
//                           type="button"
//                           disabled={disabled}
//                           onClick={() => {
//                             if (disabled) return;
//                             setSelectedSlot(slot);
//                             setBookingStage("form");
//                           }}
//                           className={[
//                             "px-2 py-1.5 rounded-lg text-[11px] md:text-xs flex flex-col border transition-all",
//                             statusClasses[slot.status],
//                             extraPastClasses,
//                             isSelected
//                               ? "ring-2 ring-brand-coral/80 ring-offset-2 ring-offset-slate-950"
//                               : "",
//                           ].join(" ")}
//                         >
//                           <span className="font-medium">
//                             {formatSlotLabelForTimeZone(
//                               slot.startTime,
//                               slot.endTime,
//                               effectiveSelectedDate,
//                               timeZone,
//                             )}
//                           </span>
//                           <span className="text-[10px] opacity-85 capitalize">
//                             {isPastSlot && slot.status === "available"
//                               ? "unavailable"
//                               : slot.status}
//                           </span>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Right: Consultant card + multi-step form + status*/}
//       {showRightPanel && (
//         <Card className="bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950 border-slate-800 shadow-xl">
//           <CardHeader className="pb-3 flex flex-row items-start justify-between gap-3">
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <div className="w-12 h-12 rounded-full bg-brand-coral/20 border border-brand-coral/60 overflow-hidden flex items-center justify-center">
//                   {RajeStroke ? (
//                     <img
//                       src={RajeStroke}
//                       alt={consultantName}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <User className="w-6 h-6 text-brand-coral" />
//                   )}
//                 </div>
//                 <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" />
//               </div>
//               <div>
//                 <p className="text-[11px] uppercase tracking-[0.2em] text-brand-coral">
//                   30–45 min discovery call
//                 </p>
//                 <h3 className="text-sm md:text-base font-semibold text-slate-50">
//                   {consultantName}
//                 </h3>
//                 <p className="text-[11px] text-slate-400">
//                   {consultantTitle}
//                 </p>
//               </div>
//             </div>

//             {/* Close form/back to time view */}
//             {bookingStage === "form" && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setBookingStage("time");
//                   setSelectedSlot(null);
//                 }}
//                 className="text-slate-500 hover:text-slate-200 transition-colors"
//                 aria-label="Close form"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </CardHeader>

//           <CardContent className="space-y-4">
//             <div className="mt-1 text-[11px] text-slate-300">
//               <p>
//                 <b>Date:</b>{" "}
//                 {selectedSlot && formattedSelectedDate
//                   ? formattedSelectedDate
//                   : "Not selected yet"}
//               </p>
//               <p>
//                 <b>Time:</b>{" "}
//                 {selectedSlot
//                   ? formatSlotLabelForTimeZone(
//                     selectedSlot.startTime,
//                     selectedSlot.endTime,
//                     effectiveSelectedDate,
//                     timeZone,
//                   )
//                   : "Pick a slot on the left"}
//               </p>
//             </div>

//             <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2.5 text-xs text-slate-300">
//               On this call, we’ll review your goals, current website/ads setup,
//               and map a simple 30–60 day plan. No pressure, no fluff.
//             </div>

//             {/* ✅ Status message block (stays visible even when form is closed) */}
//             {statusType && statusMessage && (
//               <div
//                 className={[
//                   "text-xs rounded-md border px-3 py-2",
//                   statusType === "success"
//                     ? "text-emerald-400 bg-emerald-950/40 border-emerald-800/60"
//                     : "text-red-400 bg-red-950/40 border-red-800/60",
//                 ].join(" ")}
//               >
//                 {statusMessage}
//               </div>
//             )}

//             {bookingStage === "form" && selectedSlot ? (
//               <>
//                 {/* Step indicator */}
//                 <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
//                   <div className="flex gap-1">
//                     {[0, 1, 2].map((step) => (
//                       <div
//                         key={step}
//                         className={[
//                           "h-1.5 rounded-full transition-all",
//                           step === formStep
//                             ? "w-6 bg-brand-coral"
//                             : "w-3 bg-slate-700",
//                         ].join(" ")}
//                       />
//                     ))}
//                   </div>
//                   <span>Step {formStep + 1} of 3</span>
//                 </div>

//                 <div className="space-y-3 text-xs">
//                   {/* STEP 0: Name + Email */}
//                   {formStep === 0 && (
//                     <>
//                       <div className="space-y-1.5">
//                         <label className="block text-slate-100 text-[12px]">
//                           Full name
//                         </label>
//                         <Input
//                           value={name}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             setName(value);
//                             setFieldErrors((prev) => ({
//                               ...prev,
//                               name: value.trim() ? "" : prev.name,
//                             }));
//                           }}
//                           onBlur={(e) => {
//                             const value = e.target.value;
//                             setFieldErrors((prev) => ({
//                               ...prev,
//                               name: value.trim()
//                                 ? ""
//                                 : "Name is required.",
//                             }));
//                           }}
//                           placeholder="Your name"
//                           className={inputBase}
//                         />
//                         {fieldErrors.name && (
//                           <p className="text-[11px] text-red-400 mt-0.5">
//                             {fieldErrors.name}
//                           </p>
//                         )}
//                       </div>
//                       <div className="space-y-1.5">
//                         <label className="block text-slate-100 text-[12px]">
//                           Email
//                         </label>
//                         <Input
//                           type="email"
//                           value={email}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             setEmail(value);
//                             setFieldErrors((prev) => {
//                               if (!value.trim()) {
//                                 return {
//                                   ...prev,
//                                   email: "Email is required.",
//                                 };
//                               }
//                               if (!validateEmail(value)) {
//                                 return {
//                                   ...prev,
//                                   email:
//                                     "Please enter a valid email address.",
//                                 };
//                               }
//                               return { ...prev, email: "" };
//                             });
//                           }}
//                           onBlur={(e) => {
//                             const value = e.target.value;
//                             setFieldErrors((prev) => {
//                               if (!value.trim()) {
//                                 return {
//                                   ...prev,
//                                   email: "Email is required.",
//                                 };
//                               }
//                               if (!validateEmail(value)) {
//                                 return {
//                                   ...prev,
//                                   email:
//                                     "Please enter a valid email address.",
//                                 };
//                               }
//                               return { ...prev, email: "" };
//                             });
//                           }}
//                           placeholder="you@company.com"
//                           className={inputBase}
//                         />
//                         {fieldErrors.email && (
//                           <p className="text-[11px] text-red-400 mt-0.5">
//                             {fieldErrors.email}
//                           </p>
//                         )}
//                       </div>
//                     </>
//                   )}

//                   {/* STEP 1: Phone + Service */}
//                   {formStep === 1 && (
//                     <>
//                       <div className="space-y-1.5">
//                         <label className="block text-slate-100 text-[12px]">
//                           WhatsApp / phone
//                         </label>
//                         <Input
//                           value={phone}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             setPhone(value);
//                             setFieldErrors((prev) => {
//                               if (!value.trim()) {
//                                 return {
//                                   ...prev,
//                                   phone: "Phone number is required.",
//                                 };
//                               }
//                               if (!validatePhone(value)) {
//                                 return {
//                                   ...prev,
//                                   phone:
//                                     "Please enter a valid phone number.",
//                                 };
//                               }
//                               return { ...prev, phone: "" };
//                             });
//                           }}
//                           onBlur={(e) => {
//                             const value = e.target.value;
//                             setFieldErrors((prev) => {
//                               if (!value.trim()) {
//                                 return {
//                                   ...prev,
//                                   phone: "Phone number is required.",
//                                 };
//                               }
//                               if (!validatePhone(value)) {
//                                 return {
//                                   ...prev,
//                                   phone:
//                                     "Please enter a valid phone number.",
//                                 };
//                               }
//                               return { ...prev, phone: "" };
//                             });
//                           }}
//                           placeholder="+91…"
//                           className={inputBase}
//                         />
//                         {fieldErrors.phone && (
//                           <p className="text-[11px] text-red-400 mt-0.5">
//                             {fieldErrors.phone}
//                           </p>
//                         )}
//                       </div>

//                       <div className="space-y-1.5">
//                         <label className="block text-slate-100 text-[12px]">
//                           What do you want to discuss?
//                         </label>
//                         <Select
//                           disabled={serviceLocked}
//                           value={serviceValue || undefined}
//                           onValueChange={(value) => {
//                             setServiceLocked(false);
//                             setServiceValue(value);
//                           }}
//                         >
//                           <SelectTrigger
//                             className={`${inputBase} ${serviceLocked
//                               ? "cursor-not-allowed opacity-90"
//                               : ""
//                               }`}
//                           >
//                             <SelectValue placeholder="Select a service" />
//                           </SelectTrigger>
//                           <SelectContent className="bg-slate-900 border-slate-700 text-slate-100">
//                             {services.map((service) => (
//                               <SelectItem
//                                 key={service.value}
//                                 value={service.value}
//                               >
//                                 {service.label}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                         {serviceLocked && (
//                           <p className="text-[10px] text-slate-400 mt-1">
//                             This was selected from the service page (
//                             {serviceType}).
//                           </p>
//                         )}
//                       </div>
//                     </>
//                   )}

//                   {/* STEP 2: Notes + Summary */}
//                   {formStep === 2 && (
//                     <>
//                       <div className="space-y-1.5">
//                         <label className="block text-slate-100 text-[12px]">
//                           Anything specific we should know?
//                         </label>
//                         <Textarea
//                           value={notes}
//                           onChange={(e) => setNotes(e.target.value)}
//                           placeholder="Share your website, current challenges or goals…"
//                           className={`${inputBase} min-h-[90px] text-xs`}
//                         />
//                       </div>

//                       <div className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2 text-[11px] text-slate-300">
//                         <p className="font-semibold mb-1 text-slate-100">
//                           Quick summary
//                         </p>
//                         <p>
//                           <b>Name:</b> {name || "—"}
//                         </p>
//                         <p>
//                           <b>Email:</b> {email || "—"}
//                         </p>
//                         <p>
//                           <b>Service:</b> {serviceType || "—"}
//                         </p>
//                         <p>
//                           <b>Date:</b> {formattedSelectedDate || "Not selected"}
//                         </p>
//                         <p>
//                           <b>Time:</b>{" "}
//                           {selectedSlot
//                             ? formatSlotLabelForTimeZone(
//                               selectedSlot.startTime,
//                               selectedSlot.endTime,
//                               effectiveSelectedDate,
//                               timeZone,
//                             )
//                             : "Not selected"}
//                         </p>
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 {/* Step navigation buttons */}
//                 <div
//                   className={`flex items-center pt-1 ${formStep === 0 ? "justify-end" : "justify-between"
//                     }`}
//                 >
//                   {/* Show Back button only after moving past the first step */}
//                   {formStep > 0 && (
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       onClick={() =>
//                         setFormStep((prev) =>
//                           prev > 0 ? ((prev - 1) as 0 | 1 | 2) : prev,
//                         )
//                       }
//                       className="text-white bg-red-700 hover:text-slate-50"
//                     >
//                       Back
//                     </Button>
//                   )}

//                   {formStep < 2 ? (
//                     <Button
//                       type="button"
//                       size="sm"
//                       disabled={
//                         (formStep === 0 && !canGoNextFromStep0) ||
//                         (formStep === 1 && !canGoNextFromStep1)
//                       }
//                       onClick={() =>
//                         setFormStep((prev) =>
//                           prev < 2 ? ((prev + 1) as 0 | 1 | 2) : prev,
//                         )
//                       }
//                       className="bg-brand-coral hover:bg-brand-coral-dark text-white font-semibold text-xs px-4"
//                     >
//                       Next
//                     </Button>
//                   ) : (
//                     <Button
//                       type="button"
//                       size="sm"
//                       disabled={bookingLoading}
//                       onClick={handleBook}
//                       className="bg-brand-coral hover:bg-brand-coral-dark text-white font-semibold text-xs px-4"
//                     >
//                       {bookingLoading
//                         ? "Booking your slot..."
//                         : "Confirm appointment & send details"}
//                     </Button>
//                   )}
//                 </div>

//                 <p className="text-[11px] text-slate-500 text-center mt-1">
//                   You’ll receive a confirmation email with the meeting link
//                   &amp; details after booking.
//                 </p>
//               </>
//             ) : (
//               // When form is "closed" but panel is visible due to status
//               <div className="text-[11px] text-slate-400 mt-2">
//                 {selectedSlot
//                   ? "Fill the form to confirm your slot."
//                   : "Select a date and time on the left to open the booking form."}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default AppointmentCalendar;














// // src/components/booking/AppointmentCalendar.tsx
// import React, { useEffect, useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   fetchSlots,
//   createAppointment,
//   type DaySlot,
//   type SlotStatus,
// } from "@/lib/appointmentService";
// import { ChevronLeft, ChevronRight, Clock, User, X } from "lucide-react";
// import RajeStroke from "@assets/Raje Stroke_1753273695213.png";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   timeZoneOptions,
//   type TimeZoneOptionId,
//   formatSlotLabelForTimeZone,
//   getLocalMinutesFromISTSlot,
// } from "@/utils/timezone-utils";
// import { Checkbox } from "@/components/ui/checkbox";

// interface AppointmentCalendarProps {
//   defaultServiceType?: string;
//   consultantName?: string;
//   consultantTitle?: string;
//   consultantImage?: string;
// }

// // 🔹 SAME services as ContactFormOptimized
// const services = [
//   { value: "website-development", label: "Website Development" },
//   { value: "seo", label: "SEO / AIO Services" },
//   { value: "google-ads", label: "Google Ads" },
//   { value: "dedicated-resources", label: "Dedicated Resources" },
//   {
//     value: "custom-app-development",
//     label: "Custom Web & Mobile Application Development (AI-Powered)",
//   },
// ];

// // 🔵 Light theme slot styles (Calendly-like)
// const statusClasses: Record<SlotStatus, string> = {
//   available:
//     "border border-emerald-400 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-500",
//   booked:
//     "border border-amber-400 bg-amber-50 text-amber-700 cursor-not-allowed opacity-70",
//   cancelled:
//     "border border-slate-300 bg-slate-100 text-slate-500 line-through cursor-not-allowed opacity-70",
//   completed:
//     "border border-blue-400 bg-blue-50 text-blue-700 cursor-not-allowed opacity-80",
// };

// // 🔵 Light inputs
// const inputBase =
//   "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 focus-visible:outline-none";

// // 🔹 Helpers
// const toLocalDateKey = (date: Date) => {
//   const y = date.getFullYear();
//   const m = String(date.getMonth() + 1).padStart(2, "0");
//   const d = String(date.getDate()).padStart(2, "0");
//   return `${y}-${m}-${d}`;
// };

// const parseTimeToMinutes = (time: string) => {
//   const [hh, mm] = time.split(":").map(Number);
//   return hh * 60 + mm;
// };

// type BookingStage = "date" | "time" | "form";
// type StatusType = "success" | "error" | null;

// const validateEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value.trim());

// const validatePhone = (value: string) => value.trim().length >= 7;

// export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
//   defaultServiceType = "Website Development",
//   consultantName = "Raja Rajeshwari",
//   consultantTitle = "Digital Strategy & AI Consultant",
//   // consultantImage = {RajeStroke}
// }) => {
//   const [currentMonth, setCurrentMonth] = useState(() => new Date());

//   // ✅ Start with NO date selected
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);

//   const [slots, setSlots] = useState<DaySlot[]>([]);
//   const [loadingSlots, setLoadingSlots] = useState(false);
//   const [bookingLoading, setBookingLoading] = useState(false);
//   const [selectedSlot, setSelectedSlot] = useState<DaySlot | null>(null);

//   // Slot-loading specific error
//   const [slotsError, setSlotsError] = useState<string | null>(null);

//   // Right-side status (success / error) that must show even after form is closed
//   const [statusType, setStatusType] = useState<StatusType>(null);
//   const [statusMessage, setStatusMessage] = useState<string | null>(null);

//   // Stage flow: date → time → form
//   const [bookingStage, setBookingStage] = useState<BookingStage>("date");

//   // Form state
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [notes, setNotes] = useState("");

//   // Guests (extra attendees)
//   const [showGuestField, setShowGuestField] = useState(false);
//   const [guestEmailsRaw, setGuestEmailsRaw] = useState("");

//   // Field-level validation errors
//   const [fieldErrors, setFieldErrors] = useState<{
//     name?: string;
//     email?: string;
//     phone?: string;
//   }>({});

//   // Form step inside right card (2 questions at a time)
//   const [formStep, setFormStep] = useState<0 | 1 | 2>(0);

//   // Service selection
//   // mainServiceValue = the service from URL param (if present) and locked
//   const [mainServiceValue, setMainServiceValue] = useState<string | null>(null);
//   // selectedServiceValues = additional (and/or default) services user picks
//   const [selectedServiceValues, setSelectedServiceValues] = useState<string[]>(
//     [],
//   );
//   const [serviceLocked, setServiceLocked] = useState(false);

//   // Timezone selection for display
//   const [timeZone, setTimeZone] = useState<TimeZoneOptionId>("browser");

//   const monthLabel = useMemo(() => {
//     return currentMonth.toLocaleDateString("en-GB", {
//       month: "long",
//       year: "numeric",
//     });
//   }, [currentMonth]);

//   // ✅ Use local date key
//   const selectedDateKey = useMemo(() => {
//     if (!selectedDate) return "";
//     return toLocalDateKey(selectedDate);
//   }, [selectedDate]);

//   const today = useMemo(() => {
//     const d = new Date();
//     d.setHours(0, 0, 0, 0);
//     return d;
//   }, []);

//   const todayKey = toLocalDateKey(today);

//   // Parse guests into a clean list for summary + backend
//   const guestEmailsList = useMemo(
//     () =>
//       guestEmailsRaw
//         .split(/[\n,;]/)
//         .map((e) => e.trim())
//         .filter((e) => e.length > 0),
//     [guestEmailsRaw],
//   );

//   // Derive selected service labels (main + extra)
//   const selectedServiceLabels = useMemo(() => {
//     const labels: string[] = [];

//     if (mainServiceValue) {
//       const main = services.find((s) => s.value === mainServiceValue);
//       if (main) labels.push(main.label);
//     }

//     services.forEach((s) => {
//       if (selectedServiceValues.includes(s.value)) {
//         if (!labels.includes(s.label)) {
//           labels.push(s.label);
//         }
//       }
//     });

//     return labels;
//   }, [mainServiceValue, selectedServiceValues]);

//   const hasAnyService = selectedServiceLabels.length > 0;
//   const combinedServiceType = selectedServiceLabels.join(", ");
//   const mainServiceLabel =
//     mainServiceValue &&
//     services.find((s) => s.value === mainServiceValue)?.label;

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const params = new URLSearchParams(window.location.search);
//     const serviceFromUrl = params.get("service");

//     // If service param is present in URL → treat as main/primary and lock it
//     if (serviceFromUrl) {
//       const match = services.find((s) => s.value === serviceFromUrl);
//       if (match) {
//         setMainServiceValue(match.value);
//         setServiceLocked(true);
//         return;
//       }
//     }

//     // Else, if defaultServiceType prop passed → preselect it as normal selection
//     if (defaultServiceType) {
//       const match = services.find((s) => s.label === defaultServiceType);
//       if (match) {
//         setSelectedServiceValues([match.value]);
//       }
//     }
//   }, [defaultServiceType]);

//   // Days grid for current month
//   const daysInMonth = useMemo(() => {
//     const year = currentMonth.getFullYear();
//     const month = currentMonth.getMonth();

//     const firstDay = new Date(year, month, 1);
//     const lastDay = new Date(year, month + 1, 0);
//     const firstWeekday = firstDay.getDay(); // 0 = Sunday
//     const totalDays = lastDay.getDate();

//     const days: (Date | null)[] = [];
//     const offset = (firstWeekday + 6) % 7; // shift to Monday = 0

//     for (let i = 0; i < offset; i++) {
//       days.push(null);
//     }
//     for (let d = 1; d <= totalDays; d++) {
//       days.push(new Date(year, month, d));
//     }

//     return days;
//   }, [currentMonth]);

//   // Load slots when selectedDate changes
//   useEffect(() => {
//     const loadSlots = async () => {
//       if (!selectedDateKey) return;

//       try {
//         setLoadingSlots(true);
//         setSlotsError(null);
//         const res = await fetchSlots(selectedDateKey);
//         setSlots(res.slots);
//       } catch (err: any) {
//         setSlotsError(err.message || "Failed to load slots");
//       } finally {
//         setLoadingSlots(false);
//       }
//     };

//     void loadSlots();
//   }, [selectedDateKey]);

//   const goPrevMonth = () => {
//     setCurrentMonth(
//       (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
//     );
//   };

//   const goNextMonth = () => {
//     setCurrentMonth(
//       (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
//     );
//   };

//   const resetForm = () => {
//     setName("");
//     setEmail("");
//     setPhone("");
//     setNotes("");
//     setGuestEmailsRaw("");
//     setShowGuestField(false);
//     setFormStep(0);
//     setFieldErrors({});
//   };

//   const handleBook = async () => {
//     if (!selectedDate || !selectedSlot) {
//       setStatusType("error");
//       setStatusMessage("Please select a date and time slot.");
//       return;
//     }
//     if (!hasAnyService) {
//       setStatusType("error");
//       setStatusMessage("Please select at least one service.");
//       return;
//     }

//     // Full validation for name, email, phone
//     const errors: { name?: string; email?: string; phone?: string } = {};
//     if (!name.trim()) {
//       errors.name = "Name is required.";
//     }
//     if (!email.trim()) {
//       errors.email = "Email is required.";
//     } else if (!validateEmail(email)) {
//       errors.email = "Please enter a valid email address.";
//     }
//     if (!phone.trim()) {
//       errors.phone = "Phone number is required.";
//     } else if (!validatePhone(phone)) {
//       errors.phone = "Please enter a valid phone number.";
//     }

//     if (errors.name || errors.email || errors.phone) {
//       setFieldErrors(errors);
//       setStatusType("error");
//       setStatusMessage("Please fix the highlighted fields before booking.");
//       return;
//     }

//     try {
//       setBookingLoading(true);
//       setStatusType(null);
//       setStatusMessage(null);

//       const result = await createAppointment({
//         name,
//         email,
//         phone,
//         notes,
//         // send combined service list as a single string
//         serviceType: combinedServiceType,
//         // also send structured guest emails (backend will handle invite)
//         guestEmails: guestEmailsList,
//         date: selectedDateKey,
//         // 🔹 Times stay as IST strings on the backend
//         startTime: selectedSlot.startTime,
//         endTime: selectedSlot.endTime,
//       });

//       const meetText = result?.meetingLink
//         ? ` Your Google Meet link: ${result.meetingLink}`
//         : "";

//       // ✅ Success message shown on right side even after form closes
//       setStatusType("success");
//       setStatusMessage(
//         `🎉 Appointment confirmed...! Please check your email for the Google Meet link.`,
//       );
//       setTimeout(() => setStatusMessage(null), 6000);

//       // Clear selection & form and go back to time view (form "closed")
//       setSelectedSlot(null);
//       setBookingStage("time");
//       resetForm();

//       // reload slots to mark booked
//       const res = await fetchSlots(selectedDateKey);
//       setSlots(res.slots);
//     } catch (err: any) {
//       setStatusType("error");
//       setStatusMessage(
//         err.message || "Failed to book appointment. Please try again.",
//       );
//       setTimeout(() => setStatusMessage(null), 4000);
//     } finally {
//       setBookingLoading(false);
//     }
//   };

//   const isSameDay = (d1: Date, d2: Date) =>
//     d1.getFullYear() === d2.getFullYear() &&
//     d1.getMonth() === d2.getMonth() &&
//     d1.getDate() === d2.getDate();

//   const canGoNextFromStep0 =
//     name.trim().length > 0 &&
//     email.trim().length > 0 &&
//     validateEmail(email);

//   const canGoNextFromStep1 =
//     phone.trim().length > 0 && validatePhone(phone) && hasAnyService;

//   // Format selected date for chips / labels
//   const formattedSelectedDate =
//     selectedDate &&
//     selectedDate.toLocaleDateString("en-GB", {
//       weekday: "short",
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });

//   // ✅ Only show right panel after slot selected (form) OR after a status exists
//   const showRightPanel = bookingStage === "form" || !!statusType;

//   // effective date when converting IST → target timezone
//   const effectiveSelectedDate = selectedDate || today;

//   // 🔹 Layout classes: center card when there is no right panel
//   const layoutClass = showRightPanel
//     ? "grid gap-12 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.2fr)]"
//     : "flex justify-center";

//   return (
//     <div className={layoutClass}>
//       {/* LEFT SECTION: Calendar or Time Slots */}
//       <div className={showRightPanel ? "" : "w-full max-w-lg"}>
//         <Card className="bg-white border-slate-200 shadow-md w-full">
//           <CardHeader className="flex flex-row items-center justify-between gap-3 border-b border-slate-200">
//             <div>
//               <p className="text-[12px] uppercase tracking-[0.2em] text-blue-500 font-bold">
//                 Book a strategy call
//               </p>
//               <CardTitle className="text-lg md:text-xl text-slate-900 mt-1">
//                 {bookingStage === "date"
//                   ? "Pick a date that works for you"
//                   : "Pick a time slot"}
//               </CardTitle>
//             </div>

//             {/* Month navigation only relevant while picking date */}
//             {bookingStage === "date" && (
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
//                   onClick={goPrevMonth}
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </Button>
//                 <div className="text-sm font-semibold text-slate-900 min-w-[120px] text-center">
//                   {monthLabel}
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700"
//                   onClick={goNextMonth}
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </Button>
//               </div>
//             )}

//             {/* When date is picked, show chip + change button */}
//             {bookingStage !== "date" && selectedDate && (
//               <div className="flex flex-col items-end gap-1">
//                 <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[13px] text-blue-700 font-medium">
//                   Selected date: {formattedSelectedDate}
//                 </span>
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setBookingStage("date");
//                     setSelectedSlot(null);
//                   }}
//                   className="text-[12px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
//                 >
//                   <X className="w-3 h-3" />
//                   Change date
//                 </button>
//               </div>
//             )}
//           </CardHeader>

//           <CardContent className="p-3 md:p-4 space-y-6">
//             {/* STEP 1: Calendar (stage = date) */}
//             {bookingStage === "date" && (
//               <div>
//                 <div className="grid grid-cols-7 text-[11px] md:text-[13px] text-center text-slate-500 mb-1">
//                   {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
//                     (d) => (
//                       <div key={d} className="py-1">
//                         {d}
//                       </div>
//                     ),
//                   )}
//                 </div>
//                 <div className="grid grid-cols-7 gap-1 md:gap-2">
//                   {daysInMonth.map((date, idx) => {
//                     if (!date) {
//                       return <div key={idx} className="h-9 md:h-10" />;
//                     }

//                     const day = new Date(date);
//                     day.setHours(0, 0, 0, 0);
//                     const isPastDay = day < today;
//                     const isSelected =
//                       selectedDate && isSameDay(date, selectedDate);

//                     return (
//                       <button
//                         key={idx}
//                         type="button"
//                         disabled={isPastDay}
//                         onClick={() => {
//                           setSelectedDate(date);
//                           setSelectedSlot(null);
//                           setBookingStage("time");
//                         }}
//                         className={[
//                           "h-9 md:h-10 rounded-lg text-xs md:text-sm flex items-center justify-center border transition-all",
//                           isSelected
//                             ? "bg-blue-600 text-white border-blue-600 shadow-sm font-bold"
//                             : "border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50 text-slate-700",
//                           isPastDay ? "opacity-25 cursor-not-allowed" : "",
//                         ].join(" ")}
//                       >
//                         {date.getDate()}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}

//             {/* STEP 2: Time slots (stage = time or form) */}
//             {bookingStage !== "date" && (
//               <div className="border-t border-slate-200 pt-4">
//                 <div className="flex items-center justify-between mb-3 gap-3">
//                   <div className="flex flex-col gap-1 text-xs text-slate-700">
//                     <div className="flex items-center gap-2">
//                       <Clock className="w-4 h-4 text-slate-500" />
//                       <span>
//                         {selectedDate
//                           ? selectedDate.toLocaleDateString("en-GB", {
//                               weekday: "short",
//                               day: "numeric",
//                               month: "short",
//                             })
//                           : "Select a date to see available times"}
//                       </span>
//                     </div>
//                     <span className="text-[11px] text-slate-500">
//                       Base availability:{" "}
//                       <b>4:00 PM – 11:00 PM India time (IST)</b>. Times below
//                       are shown in your selected timezone.
//                     </span>
//                   </div>

//                   <div className="flex flex-col items-end gap-1 text-[11px] text-slate-500">
//                     <div className="flex items-center gap-2 mb-1">
//                       <span className="text-[10px] text-slate-600">
//                         Showing times in:
//                       </span>
//                       <Select
//                         value={timeZone}
//                         onValueChange={(value) =>
//                           setTimeZone(value as TimeZoneOptionId)
//                         }
//                       >
//                         <SelectTrigger className="h-7 px-2 py-1 text-[10px] bg-white border-slate-300 text-slate-700">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white border-slate-200 text-slate-800 text-[11px] max-h-72">
//                           {timeZoneOptions.map((tz) => (
//                             <SelectItem key={tz.id} value={tz.id}>
//                               {tz.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="flex gap-2 text-[10px] text-slate-600">
//                       <span className="flex items-center gap-1">
//                         <span className="w-3 h-3 rounded-sm border border-emerald-400 bg-emerald-100" />
//                         Available
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <span className="w-3 h-3 rounded-sm border border-amber-400 bg-amber-100" />
//                         Booked / Unavailable
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {!selectedDate ? (
//                   <p className="text-xs text-slate-500">
//                     Choose a date on the calendar to view time slots.
//                   </p>
//                 ) : loadingSlots ? (
//                   <p className="text-xs text-slate-500">Loading slots…</p>
//                 ) : slotsError ? (
//                   <p className="text-xs text-red-500">{slotsError}</p>
//                 ) : slots.length === 0 ? (
//                   <p className="text-xs text-slate-500">
//                     No slots defined for this day.
//                   </p>
//                 ) : (
//                   <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
//                     {slots.map((slot) => {
//                       const now = new Date();
//                       const nowMinutesLocal =
//                         now.getHours() * 60 + now.getMinutes();

//                       let isPastSlot = false;

//                       if (selectedDateKey < todayKey) {
//                         isPastSlot = true;
//                       } else if (selectedDateKey === todayKey) {
//                         // Compare using LOCAL browser time version of IST endTime
//                         const endMinutesLocal = getLocalMinutesFromISTSlot(
//                           slot.endTime,
//                           effectiveSelectedDate,
//                         );
//                         if (endMinutesLocal <= nowMinutesLocal) {
//                           isPastSlot = true;
//                         }
//                       }

//                       const disabled =
//                         slot.status !== "available" || isPastSlot;

//                       const isSelected =
//                         !disabled &&
//                         selectedSlot &&
//                         selectedSlot.startTime === slot.startTime &&
//                         selectedSlot.endTime === slot.endTime;

//                       const extraPastClasses = isPastSlot
//                         ? "opacity-40 cursor-not-allowed !border-slate-200 !bg-slate-100"
//                         : "";

//                       // 🎯 Only show the START time (e.g., "04:00 PM")
//                       const fullLabel = formatSlotLabelForTimeZone(
//                         slot.startTime,
//                         slot.endTime,
//                         effectiveSelectedDate,
//                         timeZone,
//                       );
//                       const [startLabelRaw] = fullLabel.split("–");
//                       const startLabel = (startLabelRaw || fullLabel).trim();

//                       return (
//                         <button
//                           key={slot.startTime}
//                           type="button"
//                           disabled={disabled}
//                           onClick={() => {
//                             if (disabled) return;
//                             setSelectedSlot(slot);
//                             setBookingStage("form");
//                           }}
//                           className={[
//                             "px-2 py-1.5 rounded-lg text-[11px] md:text-xs flex flex-col border transition-all bg-white",
//                             statusClasses[slot.status],
//                             extraPastClasses,
//                             isSelected
//                               ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white"
//                               : "",
//                           ].join(" ")}
//                         >
//                           <span className="font-medium">{startLabel}</span>
//                           <span className="text-[10px] opacity-85 capitalize">
//                             {isPastSlot && slot.status === "available"
//                               ? "unavailable"
//                               : slot.status}
//                           </span>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Right: Consultant card + multi-step form + status*/}
//       {showRightPanel && (
//         <Card className="bg-white border-slate-200 shadow-md">
//           <CardHeader className="pb-3 flex flex-row items-start justify-between gap-3 border-b border-slate-200">
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-300 overflow-hidden flex items-center justify-center">
//                   {RajeStroke ? (
//                     <img
//                       src={RajeStroke}
//                       alt={consultantName}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <User className="w-6 h-6 text-blue-500" />
//                   )}
//                 </div>
//                 <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
//               </div>
//               <div>
//                 <p className="text-[11px] uppercase tracking-[0.2em] text-blue-500 font-medium">
//                   30–45 min discovery call
//                 </p>
//                 <h3 className="text-sm md:text-base font-semibold text-slate-900">
//                   {consultantName}
//                 </h3>
//                 <p className="text-[11px] text-slate-500">
//                   {consultantTitle}
//                 </p>
//               </div>
//             </div>

//             {/* Close form/back to time view */}
//             {bookingStage === "form" && (
//               <button
//                 type="button"
//                 onClick={() => {
//                   setBookingStage("time");
//                   setSelectedSlot(null);
//                 }}
//                 className="text-slate-500 hover:text-slate-800 transition-colors"
//                 aria-label="Close form"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             )}
//           </CardHeader>

//           <CardContent className="space-y-4 p-4">
//             <div className="mt-1 text-[11px] text-slate-700">
//               <p>
//                 <b>Date:</b>{" "}
//                 {selectedSlot && formattedSelectedDate
//                   ? formattedSelectedDate
//                   : "Not selected yet"}
//               </p>
//             <p>
//                 <b>Time:</b>{" "}
//                 {selectedSlot
//                   ? formatSlotLabelForTimeZone(
//                       selectedSlot.startTime,
//                       selectedSlot.endTime,
//                       effectiveSelectedDate,
//                       timeZone,
//                     )
//                   : "Pick a slot on the left"}
//               </p>
//             </div>

//             <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-700">
//               On this call, we’ll review your goals, current website/ads setup,
//               and map a simple 30–60 day plan. No pressure, no fluff.
//             </div>

//             {/* ✅ Status message block (stays visible even when form is closed) */}
//             {statusType && statusMessage && (
//               <div
//                 className={[
//                   "text-xs rounded-md border px-3 py-2",
//                   statusType === "success"
//                     ? "text-emerald-700 bg-emerald-50 border-emerald-200"
//                     : "text-red-700 bg-red-50 border-red-200",
//                 ].join(" ")}
//               >
//                 {statusMessage}
//               </div>
//             )}

//             {bookingStage === "form" && selectedSlot ? (
//               <>
//                 {/* Step indicator */}
//                 <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
//                   <div className="flex gap-1">
//                     {[0, 1, 2].map((step) => (
//                       <div
//                         key={step}
//                         className={[
//                           "h-1.5 rounded-full transition-all",
//                           step === formStep
//                             ? "w-6 bg-blue-600"
//                             : "w-3 bg-slate-200",
//                         ].join(" ")}
//                       />
//                     ))}
//                   </div>
//                   <span>Step {formStep + 1} of 3</span>
//                 </div>

//                 <div className="space-y-3 text-xs">
//                   {/* STEP 0: Name + Email + Guests */}
//                   {formStep === 0 && (
//                     <>
//                       <div className="space-y-1.5">
//                         <label className="block text-slate-900 text-[12px]">
//                           Full name
//                         </label>
//                         <Input
//                           value={name}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             setName(value);
//                             setFieldErrors((prev) => ({
//                               ...prev,
//                               name: value.trim() ? "" : prev.name,
//                             }));
//                           }}
//                           onBlur={(e) => {
//                             const value = e.target.value;
//                             setFieldErrors((prev) => ({
//                               ...prev,
//                               name: value.trim()
//                                 ? ""
//                                 : "Name is required.",
//                             }));
//                           }}
//                           placeholder="Your name"
//                           className={inputBase}
//                         />
//                         {fieldErrors.name && (
//                           <p className="text-[11px] text-red-500 mt-0.5">
//                             {fieldErrors.name}
//                           </p>
//                         )}
//                       </div>
//                       <div className="space-y-1.5">
//                         <label className="block text-slate-900 text-[12px]">
//                           Email
//                         </label>
//                         <Input
//                           type="email"
//                           value={email}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             setEmail(value);
//                             setFieldErrors((prev) => {
//                               if (!value.trim()) {
//                                 return {
//                                   ...prev,
//                                   email: "Email is required.",
//                                 };
//                               }
//                               if (!validateEmail(value)) {
//                                 return {
//                                   ...prev,
//                                   email:
//                                     "Please enter a valid email address.",
//                                 };
//                               }
//                               return { ...prev, email: "" };
//                             });
//                           }}
//                           onBlur={(e) => {
//                             const value = e.target.value;
//                             setFieldErrors((prev) => {
//                               if (!value.trim()) {
//                                 return {
//                                   ...prev,
//                                   email: "Email is required.",
//                                 };
//                               }
//                               if (!validateEmail(value)) {
//                                 return {
//                                   ...prev,
//                                   email:
//                                     "Please enter a valid email address.",
//                                 };
//                               }
//                               return { ...prev, email: "" };
//                             });
//                           }}
//                           placeholder="you@company.com"
//                           className={inputBase}
//                         />
//                         {fieldErrors.email && (
//                           <p className="text-[11px] text-red-500 mt-0.5">
//                             {fieldErrors.email}
//                           </p>
//                         )}
//                       </div>

//                       {/* Add guests (optional) */}
//                       <div className="space-y-1.5">
//                         <div className="flex items-center justify-between">
//                           <label className="block text-slate-900 text-[12px]">
//                             Add guests (optional)
//                           </label>
//                           <button
//                             type="button"
//                             onClick={() =>
//                               setShowGuestField((prev) => !prev)
//                             }
//                             className="text-[11px] font-medium text-blue-600 hover:text-blue-700"
//                           >
//                             {showGuestField ? "Hide guests" : "Add guests"}
//                           </button>
//                         </div>
//                         {showGuestField && (
//                           <>
//                             <Textarea
//                               value={guestEmailsRaw}
//                               onChange={(e) =>
//                                 setGuestEmailsRaw(e.target.value)
//                               }
//                               placeholder={
//                                 "guest1@company.com, guest2@company.com\nor one email per line"
//                               }
//                               className={`${inputBase} min-h-[70px] text-xs`}
//                             />
//                             <p className="text-[10px] text-slate-500">
//                               We'll send the meeting invite to these guest email
//                               addresses as well.
//                             </p>
//                           </>
//                         )}
//                       </div>
//                     </>
//                   )}

//                   {/* STEP 1: Phone + Multi-service selection */}
//                   {formStep === 1 && (
//                     <>
//                       <div className="space-y-1.5">
//                         <label className="block text-slate-900 text-[12px]">
//                           WhatsApp / phone
//                         </label>
//                         <Input
//                           value={phone}
//                           onChange={(e) => {
//                             const value = e.target.value;
//                             setPhone(value);
//                             setFieldErrors((prev) => {
//                               if (!value.trim()) {
//                                 return {
//                                   ...prev,
//                                   phone: "Phone number is required.",
//                                 };
//                               }
//                               if (!validatePhone(value)) {
//                                 return {
//                                   ...prev,
//                                   phone:
//                                     "Please enter a valid phone number.",
//                                 };
//                               }
//                               return { ...prev, phone: "" };
//                             });
//                           }}
//                           onBlur={(e) => {
//                             const value = e.target.value;
//                             setFieldErrors((prev) => {
//                               if (!value.trim()) {
//                                 return {
//                                   ...prev,
//                                   phone: "Phone number is required.",
//                                 };
//                               }
//                               if (!validatePhone(value)) {
//                                 return {
//                                   ...prev,
//                                   phone:
//                                     "Please enter a valid phone number.",
//                                 };
//                               }
//                               return { ...prev, phone: "" };
//                             });
//                           }}
//                           placeholder="+91…"
//                           className={inputBase}
//                         />
//                         {fieldErrors.phone && (
//                           <p className="text-[11px] text-red-500 mt-0.5">
//                             {fieldErrors.phone}
//                           </p>
//                         )}
//                       </div>

//                       <div className="space-y-1.5">
//                         <label className="block text-slate-900 text-[12px]">
//                           What do you want to discuss?
//                         </label>
//                         <p className="text-[11px] text-slate-500 mb-1">
//                           You can pick more than one service.
//                         </p>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//                           {services.map((service) => {
//                             const isMain =
//                               serviceLocked &&
//                               service.value === mainServiceValue;
//                             const isChecked =
//                               isMain ||
//                               selectedServiceValues.includes(service.value);

//                             return (
//                               <button
//                                 key={service.value}
//                                 type="button"
//                                 onClick={() => {
//                                   if (isMain) return;
//                                   setSelectedServiceValues((prev) =>
//                                     isChecked
//                                       ? prev.filter(
//                                           (v) => v !== service.value,
//                                         )
//                                       : [...prev, service.value],
//                                   );
//                                 }}
//                                 className={[
//                                   "flex items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-left text-[11px] transition-all",
//                                   isChecked
//                                     ? "border-blue-500 bg-blue-50"
//                                     : "border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/60",
//                                   isMain
//                                     ? "cursor-not-allowed opacity-85"
//                                     : "cursor-pointer",
//                                 ].join(" ")}
//                               >
//                                 <div className="flex items-center gap-2">
//                                   <Checkbox
//                                     checked={isChecked}
//                                     disabled={isMain}
//                                     onCheckedChange={(checked) => {
//                                       if (isMain) return;
//                                       setSelectedServiceValues((prev) =>
//                                         checked
//                                           ? [...prev, service.value]
//                                           : prev.filter(
//                                               (v) => v !== service.value,
//                                             ),
//                                       );
//                                     }}
//                                   />
//                                   <span className="text-slate-800 text-[11px]">
//                                     {service.label}
//                                     {isMain && (
//                                       <span className="ml-1 text-[10px] text-blue-600 font-medium">
//                                         (Main)
//                                       </span>
//                                     )}
//                                   </span>
//                                 </div>
//                               </button>
//                             );
//                           })}
//                         </div>

//                         {serviceLocked && mainServiceLabel && (
//                           <p className="text-[10px] text-slate-500 mt-1">
//                             Main service pre-selected from the service page (
//                             {mainServiceLabel}). You can add more services
//                             above.
//                           </p>
//                         )}
//                       </div>
//                     </>
//                   )}

//                   {/* STEP 2: Notes + Summary */}
//                   {formStep === 2 && (
//                     <>
//                       <div className="space-y-1.5">
//                         <label className="block text-slate-900 text-[12px]">
//                           Anything specific we should know?
//                         </label>
//                         <Textarea
//                           value={notes}
//                           onChange={(e) => setNotes(e.target.value)}
//                           placeholder="Share your website, current challenges or goals…"
//                           className={`${inputBase} min-h-[90px] text-xs`}
//                         />
//                       </div>

//                       <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] text-slate-700">
//                         <p className="font-semibold mb-1 text-slate-900">
//                           Quick summary
//                         </p>
//                         <p>
//                           <b>Name:</b> {name || "—"}
//                         </p>
//                         <p>
//                           <b>Email:</b> {email || "—"}
//                         </p>
//                         <p>
//                           <b>Service(s):</b>{" "}
//                           {combinedServiceType || "Not selected"}
//                         </p>
//                         <p>
//                           <b>Date:</b> {formattedSelectedDate || "Not selected"}
//                         </p>
//                         <p>
//                           <b>Time:</b>{" "}
//                           {selectedSlot
//                             ? formatSlotLabelForTimeZone(
//                                 selectedSlot.startTime,
//                                 selectedSlot.endTime,
//                                 effectiveSelectedDate,
//                                 timeZone,
//                               )
//                             : "Not selected"}
//                         </p>
//                         {guestEmailsList.length > 0 && (
//                           <p>
//                             <b>Guests:</b>{" "}
//                             {guestEmailsList.join(", ")}
//                           </p>
//                         )}
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 {/* Step navigation buttons */}
//                 <div
//                   className={`flex items-center pt-1 ${
//                     formStep === 0 ? "justify-end" : "justify-between"
//                   }`}
//                 >
//                   {/* Show Back button only after moving past the first step */}
//                   {formStep > 0 && (
//                     <Button
//                       type="button"
//                       variant="ghost"
//                       size="sm"
//                       onClick={() =>
//                         setFormStep((prev) =>
//                           prev > 0 ? ((prev - 1) as 0 | 1 | 2) : prev,
//                         )
//                       }
//                       className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
//                     >
//                       Back
//                     </Button>
//                   )}

//                   {formStep < 2 ? (
//                     <Button
//                       type="button"
//                       size="sm"
//                       disabled={
//                         (formStep === 0 && !canGoNextFromStep0) ||
//                         (formStep === 1 && !canGoNextFromStep1)
//                       }
//                       onClick={() =>
//                         setFormStep((prev) =>
//                           prev < 2 ? ((prev + 1) as 0 | 1 | 2) : prev,
//                         )
//                       }
//                       className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4"
//                     >
//                       Next
//                     </Button>
//                   ) : (
//                     <Button
//                       type="button"
//                       size="sm"
//                       disabled={bookingLoading}
//                       onClick={handleBook}
//                       className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4"
//                     >
//                       {bookingLoading
//                         ? "Booking your slot..."
//                         : "Confirm appointment & send details"}
//                     </Button>
//                   )}
//                 </div>

//                 <p className="text-[11px] text-slate-500 text-center mt-1">
//                   You’ll receive a confirmation email with the meeting link
//                   &amp; details after booking.
//                 </p>
//               </>
//             ) : (
//               // When form is "closed" but panel is visible due to status
//               <div className="text-[11px] text-slate-500 mt-2">
//                 {selectedSlot
//                   ? "Fill the form to confirm your slot."
//                   : "Select a date and time on the left to open the booking form."}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default AppointmentCalendar;

