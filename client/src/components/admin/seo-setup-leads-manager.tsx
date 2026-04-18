import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarClock,
  Eye,
  Globe,
  Mail,
  MoreHorizontal,
  RefreshCcw,
  Search,
  Trash2,
  User2,
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
import {
  deleteSeoSetupLead,
  fetchSeoSetupLeadById,
  fetchSeoSetupLeads,
} from "@/lib/seoSetupLeadService";

export interface SeoSetupLead {
  _id?: string;
  id?: string | number;
  fullName: string;
  websiteUrl: string;
  email: string;
  createdAt?: string;
}

export function SeoSetupLeadsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<SeoSetupLead | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const {
    data: leads = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<SeoSetupLead[]>({
    queryKey: ["seo-setup-leads"],
    queryFn: fetchSeoSetupLeads,
  });

  const {
    data: leadDetails,
    isLoading: isLeadDetailsLoading,
  } = useQuery<SeoSetupLead>({
    queryKey: ["seo-setup-lead-details", selectedLeadId],
    queryFn: () => fetchSeoSetupLeadById(selectedLeadId as string),
    enabled: !!selectedLeadId && viewDialogOpen,
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteSeoSetupLead(id);
    },
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, pageSize]);

  const filteredLeads = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = leads.filter((lead) => {
      const matchesSearch =
        !normalizedSearch ||
        lead.fullName?.toLowerCase().includes(normalizedSearch) ||
        lead.email?.toLowerCase().includes(normalizedSearch) ||
        lead.websiteUrl?.toLowerCase().includes(normalizedSearch);

      const createdDate = lead.createdAt
        ? new Date(lead.createdAt).toISOString().slice(0, 10)
        : "";

      const matchesDate = !dateFilter || createdDate === dateFilter;

      return matchesSearch && matchesDate;
    });

    return [...filtered].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [leads, searchTerm, dateFilter]);

  const totalItems = filteredLeads.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedLeads = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    return filteredLeads.slice(startIndex, startIndex + pageSize);
  }, [filteredLeads, currentPage, totalPages, pageSize]);

  const stats = useMemo(() => {
    const total = leads.length;

    const today = new Date().toISOString().slice(0, 10);
    const todayCount = leads.filter((lead) => {
      if (!lead.createdAt) return false;
      return new Date(lead.createdAt).toISOString().slice(0, 10) === today;
    }).length;

    const withWebsite = leads.filter((lead) => !!lead.websiteUrl?.trim()).length;

    return {
      total,
      todayCount,
      withWebsite,
    };
  }, [leads]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleView = (lead: SeoSetupLead) => {
    const id = String(lead._id || lead.id || "");
    setSelectedLead(lead);
    setSelectedLeadId(id || null);
    setViewDialogOpen(true);
  };

  const handleDelete = (lead: SeoSetupLead) => {
    const id = String(lead._id || lead.id || "");
    if (!id) {
      window.alert("Lead id is missing");
      return;
    }

    const ok = window.confirm(
      `Are you sure you want to delete the lead from ${lead.fullName}?`,
    );
    if (!ok) return;

    deleteLeadMutation.mutate(id);
  };

  const renderPaginationButtons = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i += 1) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i += 1) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <span
            key={`ellipsis-${index}`}
            className="px-2 text-sm text-muted-foreground"
          >
            ...
          </span>
        );
      }

      const isActive = currentPage === page;

      return (
        <Button
          key={page}
          type="button"
          size="sm"
          variant={isActive ? "default" : "outline"}
          onClick={() => handlePageChange(Number(page))}
          className="min-w-9"
        >
          {page}
        </Button>
      );
    });
  };

  const detailLead = leadDetails || selectedLead;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <User2 className="h-4 w-4" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            <p className="mt-1 text-sm text-slate-500">
              All SEO setup lead submissions
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <CalendarClock className="h-4 w-4" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {stats.todayCount}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Leads created today
            </p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Globe className="h-4 w-4" />
              With Website
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {stats.withWebsite}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Leads that submitted website URL
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-slate-900">
              SEO Setup Leads
            </CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              View, search, and manage submitted SEO setup leads
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search name, email, website..."
                className="pl-9"
              />
            </div>

            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="sm:w-[180px]"
            />

            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setDateFilter("");
                refetch();
              }}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Loading SEO setup leads...
            </div>
          ) : isError ? (
            <div className="py-10 text-center text-sm text-red-500">
              Failed to load SEO setup leads.
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">
              No SEO setup leads found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-separate border-spacing-0">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Website
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Submitted On
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedLeads.map((lead) => {
                      const rowId = String(lead._id || lead.id || "");
                      const createdAtLabel = lead.createdAt
                        ? new Date(lead.createdAt).toLocaleString()
                        : "-";

                      return (
                        <tr
                          key={rowId || `${lead.email}-${lead.fullName}`}
                          className="border-b border-slate-100"
                        >
                          <td className="px-4 py-4 align-middle">
                            <div className="font-medium text-slate-900">
                              {lead.fullName || "-"}
                            </div>
                          </td>

                          <td className="px-4 py-4 align-middle">
                            <div className="flex items-center gap-2 text-slate-700">
                              <Mail className="h-4 w-4 text-slate-400" />
                              <span>{lead.email || "-"}</span>
                            </div>
                          </td>

                          <td className="px-4 py-4 align-middle">
                            {lead.websiteUrl ? (
                              <a
                                href={lead.websiteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                              >
                                <Globe className="h-4 w-4" />
                                <span className="max-w-[240px] truncate">
                                  {lead.websiteUrl}
                                </span>
                              </a>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>

                          <td className="px-4 py-4 align-middle">
                            <Badge
                              variant="outline"
                              className="rounded-full px-3 py-1 text-xs font-medium"
                            >
                              {createdAtLabel}
                            </Badge>
                          </td>

                          <td className="px-4 py-4 align-middle text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleView(lead)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => handleDelete(lead)}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-slate-900">
                    {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-slate-900">
                    {Math.min(currentPage * pageSize, totalItems)}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-900">{totalItems}</span>{" "}
                  leads
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none"
                  >
                    <option value={10}>10 / page</option>
                    <option value={25}>25 / page</option>
                    <option value={50}>50 / page</option>
                  </select>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </Button>

                  <div className="flex items-center gap-1">{renderPaginationButtons()}</div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>SEO Setup Lead Details</DialogTitle>
          </DialogHeader>

          {isLeadDetailsLoading ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Loading lead details...
            </div>
          ) : !detailLead ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No lead details found.
            </div>
          ) : (
            <div className="grid gap-4 py-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Full Name
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {detailLead.fullName || "-"}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Email Address
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {detailLead.email || "-"}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Website URL
                </div>
                {detailLead.websiteUrl ? (
                  <a
                    href={detailLead.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    {detailLead.websiteUrl}
                  </a>
                ) : (
                  <div className="text-sm font-medium text-slate-900">-</div>
                )}
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created At
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {detailLead.createdAt
                    ? new Date(detailLead.createdAt).toLocaleString()
                    : "-"}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}