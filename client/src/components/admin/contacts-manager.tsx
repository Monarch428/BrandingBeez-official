import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Mail,
  Phone,
  Building,
  Calendar,
  Search,
  ExternalLink,
  MessageCircle,
  Trash2,
} from "lucide-react";
import { useAppToast } from "../ui/toaster";
import { adminApiRequest } from "@/lib/adminApi";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  attachmentFilename?: string;
  attachmentOriginalName?: string;
  inquiry_type: string;
  message: string;
  preferred_contact: string;
  country: string;
  topPriority: string;
  couponCode?: string;
  createdAt: string;

  // Enhanced service details
  servicesSelected?: string[];
  budget?: string;
  timeline?: string;
  referralSource?: string;
  serviceDetails?: any;
  automationDetails?: any;
  dedicatedResourceDetails?: any;
  websiteDetails?: any;
  contactFormType?: string;
}

export function ContactsManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // ✅ Custom confirm dialog state (no window.confirm)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const queryClient = useQueryClient();

  // ✅ Your toast hook
  const appToast = useAppToast();

  const {
    data: contacts = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/api/contacts"],
    queryFn: async () => {
      // ✅ Token used here as well
      return adminApiRequest<Contact[]>("/api/contacts", "GET");
    },
  });

  const filteredContacts = useMemo(() => {
    return (contacts as Contact[]).filter((contact: Contact) => {
      const matchesSearch =
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" ||
        (contact.contactFormType || "contact-form") === filterType;

      return matchesSearch && matchesType;
    });
  }, [contacts, searchTerm, filterType]);

  // ✅ Fix Set iteration issue (no [...new Set()])
  const uniqueContactFormTypes = useMemo(() => {
    const map = (contacts as Contact[]).reduce((acc, c) => {
      const key = c.contactFormType || "contact-form";
      acc[key] = true;
      return acc;
    }, {} as Record<string, true>);

    return Object.keys(map);
  }, [contacts]);

  const deleteMutation = useMutation({
    mutationFn: async (payload: { id: number; name: string; email: string }) => {
      // ✅ Token enforced for delete too (central helper)
      return adminApiRequest(`/api/contacts/${payload.id}`, "DELETE");
    },

    onSuccess: (_data, variables) => {
      // ✅ After successful action, show contact infos
      appToast.success(`${variables.name} • ${variables.email}`, "Contact deleted");

      // ✅ Refresh list
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      refetch();

      // Close dialog
      setConfirmOpen(false);
      setSelectedContact(null);
    },

    onError: (error: any) => {
      console.error("Delete contact error:", error);

      // ✅ Custom toast (no window.alert)
      appToast.error(
        error?.message || "Failed to delete contact. Please try again.",
        "Delete failed"
      );
    },
  });

  const handleEmailContact = (email: string, name: string) => {
    const subject = `Re: Your inquiry from BrandingBeez`;
    const body = `Hi ${name},\n\nThank you for reaching out to BrandingBeez. We received your inquiry and would love to discuss your project further.\n\nBest regards,\nBrandingBeez Team`;
    window.open(
      `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );
  };

  const getContactFormTypeLabel = (type?: string) => {
    const labels: Record<string, string> = {
      "home-contact-form": "Home Page Contact Form",
      "service-page-contact-form": "Service Page Contact Form",
      "dedicated-resource-contact-form": "Dedicated Resource Contact Form",
      "pricing-calculator": "Pricing Calculator Contact Form",
      "entry-popup-contact-form": "Entry Pop-up Contact Form",
      "exit-popup-contact-form": "Exit Pop-up Contact Form",
      "contact-us-page-contact-form": "Contact Us Page Contact Form",
      "newsletter-contact-form": "Newsletter Contact Form",
      "contact-form": "General Contact Form",
    };
    return labels[type || "contact-form"] || "General Contact Form";
  };

  const openDeleteConfirm = (contact: Contact) => {
    setSelectedContact(contact);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedContact) return;
    deleteMutation.mutate({
      id: selectedContact.id,
      name: selectedContact.name,
      email: selectedContact.email,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contact Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading contacts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Contact Submissions ({(contacts as Contact[]).length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Filter by contact form type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Contact Forms</SelectItem>
                {uniqueContactFormTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getContactFormTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contacts List */}
          <div className="space-y-4">
            {filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm || filterType !== "all"
                  ? "No contacts match your filters"
                  : "No contact submissions yet"}
              </div>
            ) : (
              filteredContacts.map((contact: Contact) => (
                <Card key={contact.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Contact Info */}
                      <div className="lg:col-span-1">
                        <h3 className="font-semibold text-lg mb-2">{contact.name}</h3>

                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{contact.email}</span>
                          </div>

                          {contact.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{contact.phone}</span>
                            </div>
                          )}

                          {contact.company && (
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              <span>{contact.company}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {contact.attachmentFilename && (
                          <div className="mt-2">
                            <a
                              href={`/uploads/contact_files/${encodeURIComponent(
                                contact.attachmentFilename
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 inline-flex items-center gap-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Download attachment{" "}
                              {contact.attachmentOriginalName
                                ? `(${contact.attachmentOriginalName})`
                                : ""}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Message & Details */}
                      <div className="lg:col-span-1">
                        <div className="mb-3">
                          <Badge variant="outline" className="mb-2">
                            {contact.inquiry_type
                              .replace(/-/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>

                          {contact.couponCode && (
                            <Badge variant="secondary" className="ml-2">
                              Coupon: {contact.couponCode}
                            </Badge>
                          )}
                        </div>

                        <div className="text-sm text-gray-700">
                          <div className="max-h-32 overflow-y-auto">
                            {contact.message.split("\n").map((line, index) => {
                              if (
                                line.startsWith("📋") ||
                                line.startsWith("👥") ||
                                line.startsWith("🔍") ||
                                line.startsWith("🎯") ||
                                line.startsWith("⚙️") ||
                                line.startsWith("🤖") ||
                                line.startsWith("💰") ||
                                line.startsWith("⏰") ||
                                line.startsWith("📢")
                              ) {
                                return (
                                  <div
                                    key={index}
                                    className="font-semibold text-blue-600 mt-2"
                                  >
                                    {line}
                                  </div>
                                );
                              } else if (line.startsWith("•")) {
                                return (
                                  <div key={index} className="ml-4 text-gray-600">
                                    {line}
                                  </div>
                                );
                              } else {
                                return <div key={index}>{line}</div>;
                              }
                            })}
                          </div>
                        </div>

                        {contact.topPriority && (
                          <p className="text-sm text-blue-600 mt-2">
                            <strong>Priority:</strong> {contact.topPriority}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-1 flex flex-col gap-2">
                        <div className="space-y-1 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {getContactFormTypeLabel(contact.contactFormType)}
                          </Badge>
                        </div>

                        <Button
                          onClick={() => handleEmailContact(contact.email, contact.name)}
                          size="sm"
                          className="w-full"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Reply via Email
                        </Button>

                        <Button
                          onClick={() => openDeleteConfirm(contact)}
                          size="sm"
                          variant="destructive"
                          className="w-full"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deleteMutation.isPending ? "Deleting..." : "Delete Contact"}
                        </Button>

                        <div className="text-xs text-gray-500 text-center">
                          Preferred contact: {contact.preferred_contact}
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          Location: {contact.country}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* ✅ Custom Confirm Dialog (no window.confirm) */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this contact?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
              {selectedContact ? (
                <div className="mt-2 text-sm">
                  <div className="font-medium text-foreground">
                    {selectedContact.name}
                  </div>
                  <div className="text-muted-foreground">{selectedContact.email}</div>
                </div>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSelectedContact(null);
                setConfirmOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending || !selectedContact}
            >
              {deleteMutation.isPending ? "Deleting..." : "Yes, delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
