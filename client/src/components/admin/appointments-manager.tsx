import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarClock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Link as LinkIcon,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type AppointmentStatus = "booked" | "cancelled" | "completed";

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone?: string;
  serviceType?: string;
  notes?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: AppointmentStatus;
  createdAt: string;
  updatedAt?: string;

  // NEW – from backend
  meetingLink?: string;
  guestEmails?: string[];
}

export function AppointmentsManager() {
  const [statusFilter, setStatusFilter] = useState<"all" | AppointmentStatus>(
    "all",
  );
  const [dateFilter, setDateFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // For Edit-status dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [editStatus, setEditStatus] = useState<AppointmentStatus>("booked");

  const {
    data: appointments = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Appointment[]>({
    // include filters in the key so query refires when they change
    queryKey: ["/api/admin/appointments", { statusFilter, dateFilter }],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");

      const params = new URLSearchParams();
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      if (dateFilter) {
        params.set("date", dateFilter);
      }

      const url =
        "/api/admin/appointments" +
        (params.toString() ? `?${params.toString()}` : "");

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: AppointmentStatus;
    }) => {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update appointment status");
      }
      return res.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  const deleteAppointmentMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete appointment");
      }
      return res.json();
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Reset to first page when filters or page size change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateFilter, pageSize]);

  // Backend is already filtering by date/status, but we:
  // 1) apply same filters defensively
  // 2) SORT so latest createdAt is on top
  const filteredAppointments = useMemo(() => {
    const filtered = appointments.filter((appt) => {
      if (statusFilter !== "all" && appt.status !== statusFilter) {
        return false;
      }
      if (dateFilter && appt.date !== dateFilter) {
        return false;
      }
      return true;
    });

    // Latest entry on top – sort by createdAt DESC
    return [...filtered].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime();
      const bTime = new Date(b.createdAt).getTime();
      return bTime - aTime;
    });
  }, [appointments, statusFilter, dateFilter]);

  const totalItems = filteredAppointments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedAppointments = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    return filteredAppointments.slice(startIndex, startIndex + pageSize);
  }, [filteredAppointments, currentPage, pageSize, totalPages]);

  const stats = useMemo(() => {
    const total = appointments.length;
    const booked = appointments.filter((a) => a.status === "booked").length;
    const completed = appointments.filter((a) => a.status === "completed")
      .length;
    const cancelled = appointments.filter((a) => a.status === "cancelled")
      .length;
    return { total, booked, completed, cancelled };
  }, [appointments]);

  const getStatusBadgeStyle = (status: AppointmentStatus) => {
    switch (status) {
      case "booked":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "completed":
        return "bg-green-50 text-green-700 border border-green-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "";
    }
  };

  const handleStatusChange = (id: number, status: AppointmentStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm(
      "Are you sure you want to delete this appointment?",
    );
    if (!ok) return;
    deleteAppointmentMutation.mutate(id);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Build simple page number array (max 5 pages visible)
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    if (end - start < maxButtons - 1) {
      start = Math.max(1, end - maxButtons + 1);
    }
    for (let p = start; p <= end; p++) {
      pages.push(p);
    }
    return pages;
  }, [currentPage, totalPages]);

  // Open edit dialog with current row/status
  const openEditDialog = (appt: Appointment) => {
    setEditingAppointment(appt);
    setEditStatus(appt.status);
    setEditDialogOpen(true);
  };

  const handleSaveStatus = () => {
    if (!editingAppointment) return;
    handleStatusChange(editingAppointment.id, editStatus);
    setEditDialogOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-purple/10 flex items-center justify-center">
                <CalendarClock className="w-5 h-5 text-brand-purple" />
              </div>
              <div>
                <CardTitle className="text-xl">Appointments</CardTitle>
                <p className="text-sm text-gray-600">
                  View and manage all booked appointments from the website
                  calendar.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs sm:text-sm justify-start sm:justify-end">
              <Badge variant="outline">
                Total: <span className="font-semibold ml-1">{stats.total}</span>
              </Badge>
              <Badge
                variant="outline"
                className="border-blue-200 text-blue-700"
              >
                Booked:{" "}
                <span className="font-semibold ml-1">{stats.booked}</span>
              </Badge>
              <Badge
                variant="outline"
                className="border-green-200 text-green-700"
              >
                Completed:{" "}
                <span className="font-semibold ml-1">{stats.completed}</span>
              </Badge>
              <Badge variant="outline" className="border-red-200 text-red-700">
                Cancelled:{" "}
                <span className="font-semibold ml-1">{stats.cancelled}</span>
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Filters + page size + refresh */}
            <div className="flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">
              <div className="flex flex-wrap gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Filter by date
                  </label>
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-44"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Filter by status
                  </label>
                  <div className="flex gap-1 flex-wrap">
                    {["all", "booked", "completed", "cancelled"].map(
                      (status) => (
                        <Button
                          key={status}
                          type="button"
                          size="sm"
                          variant={
                            statusFilter === status ? "default" : "outline"
                          }
                          className={
                            statusFilter === status
                              ? "bg-brand-purple text-white"
                              : "text-gray-700"
                          }
                          onClick={() =>
                            setStatusFilter(status as "all" | AppointmentStatus)
                          }
                        >
                          {status === "all"
                            ? "All"
                            : status.charAt(0).toUpperCase() +
                            status.slice(1)}
                        </Button>
                      ),
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 items-end lg:justify-end">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-600">
                    Rows per page
                  </label>
                  <select
                    className="border border-gray-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDateFilter("");
                    setStatusFilter("all");
                    setCurrentPage(1);
                    refetch();
                  }}
                  className="flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset & Refresh</span>
                </Button>
              </div>
            </div>

            {/* Content states */}
            {isLoading && (
              <div className="text-center py-10 text-gray-500">
                Loading appointments...
              </div>
            )}

            {isError && (
              <div className="text-center py-10 text-red-500">
                Failed to load appointments.
              </div>
            )}

            {!isLoading && !isError && filteredAppointments.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No appointments found for current filters.
              </div>
            )}

            {/* Table + pagination */}
            {!isLoading && !isError && filteredAppointments.length > 0 && (
              <>
                <div className="overflow-x-auto border border-gray-100 rounded-xl bg-white">
                  <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Date & Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Client
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 max-w-5">
                          Guests
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Service
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Meeting
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                          Notes
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedAppointments.map((appt) => (
                        <tr key={appt.id} className="border-t border-gray-100">
                          <td className="px-4 py-3 align-top">
                            <div className="font-medium text-gray-900">
                              {appt.date}
                            </div>
                            <div className="text-xs text-gray-500">
                              {appt.startTime} – {appt.endTime}
                            </div>
                            <div className="text-[11px] text-gray-400 mt-1">
                              Created:{" "}
                              {new Date(appt.createdAt).toLocaleString("en-GB")}
                            </div>
                          </td>

                          <td className="px-4 py-3 align-top max-w-[200px]">
                            <div className="font-medium text-gray-900">
                              {appt.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {appt.email}
                            </div>
                            {appt.phone && (
                              <div className="text-xs text-gray-400">
                                {appt.phone}
                              </div>
                            )}
                          </td>

                          {/* Guests column */}
                          <td className="px-4 py-3 text-left align-top max-w-[180px]">
                            {appt.guestEmails && appt.guestEmails.length > 0 ? (
                              <div className="text-xs text-gray-700 break-words">
                                {appt.guestEmails.join(", ")}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>

                          <td className="px-4 py-3 align-top max-w-[180px]">
                            <div className="text-sm text-gray-800 whitespace-normal break-words">
                              {appt.serviceType || "—"}
                            </div>
                          </td>

                          {/* Meeting link column */}
                          <td className="px-4 py-3 align-top">
                            {appt.meetingLink ? (
                              <a
                                href={appt.meetingLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                              >
                                <LinkIcon className="w-3 h-3" />
                                Join link
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">—</span>
                            )}
                          </td>

                          <td className="px-4 py-3 align-top">
                            <Badge className={getStatusBadgeStyle(appt.status)}>
                              {appt.status.charAt(0).toUpperCase() +
                                appt.status.slice(1)}
                            </Badge>
                          </td>

                          <td className="px-4 py-3 align-top max-w-sm">
                            <div className="text-xs text-gray-600 line-clamp-3">
                              {appt.notes || "—"}
                            </div>
                          </td>

                          {/* Actions: 3-dot dropdown with Edit + Delete */}
                          <td className="px-4 py-3 align-top">
                            <div className="flex justify-end">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">
                                      Open actions
                                    </span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => openEditDialog(appt)}
                                  >
                                    Edit status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600"
                                    onClick={() => handleDelete(appt.id)}
                                  >
                                    Delete appointment
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 pt-3">
                  <div className="text-xs sm:text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-medium">
                      {startItem}-{endItem}
                    </span>{" "}
                    of <span className="font-medium">{totalItems}</span>{" "}
                    appointments
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {pageNumbers.map((page) => (
                        <Button
                          key={page}
                          type="button"
                          size="sm"
                          variant={
                            page === currentPage ? "default" : "outline"
                          }
                          className={
                            page === currentPage
                              ? "bg-brand-purple text-white px-3"
                              : "text-gray-700 px-3"
                          }
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit status "popover" dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change appointment status</DialogTitle>
          </DialogHeader>

          {editingAppointment && (
            <div className="space-y-4 text-sm">
              <div className="text-gray-700">
                <div className="font-medium">{editingAppointment.name}</div>
                <div className="text-xs text-gray-500">
                  {editingAppointment.date} •{" "}
                  {editingAppointment.startTime} –{" "}
                  {editingAppointment.endTime}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600">
                  Select new status
                </p>
                <div className="flex gap-2 flex-wrap">
                  {(["booked", "completed", "cancelled"] as AppointmentStatus[]).map(
                    (status) => (
                      <Button
                        key={status}
                        type="button"
                        variant={
                          editStatus === status ? "default" : "outline"
                        }
                        size="sm"
                        className={
                          editStatus === status
                            ? "bg-brand-purple text-white"
                            : "text-gray-700"
                        }
                        onClick={() => setEditStatus(status)}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => setEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveStatus}
              disabled={
                !editingAppointment || updateStatusMutation.isPending
              }
            >
              {updateStatusMutation.isPending ? "Saving..." : "Save status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
