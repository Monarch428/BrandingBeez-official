"use client";

import React, { createContext, useContext, useState } from "react";
import { ThankYouPopup } from "@/components/thank-you-popup";

export interface ThankYouPayload {
  title?: string;
  message: string;
  formType?: "strategy" | "contact" | "inquiry" | "newsletter";
}

interface ThankYouContextType {
  showThankYou: (payload: ThankYouPayload) => void;
}

const ThankYouContext = createContext<ThankYouContextType | null>(null);

export const useThankYou = () => {
  const ctx = useContext(ThankYouContext);
  if (!ctx) {
    throw new Error("useThankYou must be used inside ThankYouProvider");
  }
  return ctx;
};

export const ThankYouProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<ThankYouPayload | null>(null);

  const showThankYou = (data: ThankYouPayload) => {
    setPayload(data);
    setOpen(true);
  };

  return (
    <ThankYouContext.Provider value={{ showThankYou }}>
      {children}

      {/* ✅ ONE global popup, rendered via portal */}
      {payload && (
        <ThankYouPopup
          isOpen={open}
          onClose={() => setOpen(false)}
          title={payload.title}
          message={payload.message}
          formType={payload.formType}
        />
      )}
    </ThankYouContext.Provider>
  );
};
