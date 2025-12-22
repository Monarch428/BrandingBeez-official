import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  ToastProvider as RadixToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  type ToastProps,
} from "@/components/ui/toast";

type ToastVariant = ToastProps["variant"]; // "default" | "destructive"
type AppToastKind = "success" | "error" | "info";

export interface AppToastOptions {
  id?: number;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  kind?: AppToastKind;
}

interface InternalToast extends AppToastOptions {
  id: number;
  open: boolean;
}

interface AppToastContextValue {
  toasts: InternalToast[];
  show: (opts: AppToastOptions) => void;
  success: (description: string, title?: string) => void;
  error: (description: string, title?: string) => void;
  info: (description: string, title?: string) => void;
  dismiss: (id: number) => void;
}

const AppToastContext = createContext<AppToastContextValue | null>(null);

/**
 * Wrap your app with this:
 *
 * <AppToastProvider>
 *   <App />
 * </AppToastProvider>
 */
export function AppToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<InternalToast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (opts: AppToastOptions) => {
      const id = opts.id ?? Date.now();

      setToasts((prev) => [
        ...prev,
        {
          id,
          open: true,
          variant: opts.variant ?? "default",
          kind: opts.kind ?? "info",
          title: opts.title,
          description: opts.description,
        },
      ]);

      // auto-hide after 3s
      setTimeout(() => dismiss(id), 3000);
    },
    [dismiss],
  );

  const success = useCallback(
    (description: string, title = "Success") => {
      show({
        kind: "success",
        variant: "default",
        title,
        description,
      });
    },
    [show],
  );

  const error = useCallback(
    (description: string, title = "Error") => {
      show({
        kind: "error",
        variant: "destructive",
        title,
        description,
      });
    },
    [show],
  );

  const info = useCallback(
    (description: string, title = "Info") => {
      show({
        kind: "info",
        variant: "default",
        title,
        description,
      });
    },
    [show],
  );

  const value = useMemo(
    () => ({ toasts, show, success, error, info, dismiss }),
    [toasts, show, success, error, info, dismiss],
  );

  return (
    <AppToastContext.Provider value={value}>
      <RadixToastProvider swipeDirection="right">
        {children}

        {/* Render toasts */}
        {toasts.map((t) => (
          <Toast
            key={t.id}
            open={t.open}
            onOpenChange={(open) => {
              if (!open) dismiss(t.id);
            }}
            variant={t.variant}
          >
            <div className="flex flex-col gap-1">
              {t.title && <ToastTitle>{t.title}</ToastTitle>}
              {t.description && (
                <ToastDescription>{t.description}</ToastDescription>
              )}
            </div>
            <ToastClose />
          </Toast>
        ))}

        <ToastViewport />
      </RadixToastProvider>
    </AppToastContext.Provider>
  );
}

export function useAppToast() {
  const ctx = useContext(AppToastContext);
  if (!ctx) {
    throw new Error("useAppToast must be used inside <AppToastProvider>");
  }
  return ctx;
}
