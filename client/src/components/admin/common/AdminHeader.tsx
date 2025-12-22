// components/admin/AdminHeader.tsx
import { Button } from "@/components/ui/button";
import { KeyRound, Settings } from "lucide-react";

interface HeaderProps {
  email?: string;
  googleStatus: "Connected" | "Not connected";
  onLogout: () => void;
}

export function AdminHeader({ email, googleStatus, onLogout }: HeaderProps) {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-purple rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-brand-purple">
            Admin Dashboard
          </h1>
          <p className="text-xs text-gray-500">{email}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border">
          <KeyRound className="w-4 h-4" />
          <span
            className={
              googleStatus === "Connected"
                ? "text-green-600"
                : "text-red-600"
            }
          >
            Google: {googleStatus}
          </span>
        </div>

        <Button
          variant="outline"
          className="text-red-600 hover:bg-red-50"
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
