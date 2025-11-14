import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Calendar,
  Search,
  Download,
  MessageCircle,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface NewsletterSubscriber {
  id: number;
  name: string;
  email: string;
  subscribedAt: Date;
}

export function NewsletterSubscribersManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: subscribers = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/newsletter/subscribers"],
    queryFn: async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch("/api/newsletter/subscribers", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch newsletter subscribers");
      }

      return response.json();
    },
  });

  const filteredSubscribers = (subscribers as NewsletterSubscriber[]).filter(
    (subscriber: NewsletterSubscriber) => {
      const matchesSearch =
        subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    }
  );

  const deleteSubscriberMutation = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`/api/newsletter/subscribers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to delete newsletter subscriber"
        );
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/newsletter/subscribers"],
      });
      refetch();
      alert("Subscriber deleted successfully!");
    },
    onError: (error) => {
      console.error("Delete subscriber error:", error);
      alert("Failed to delete subscriber. Please try again.");
    },
  });

  const handleEmailSubscriber = (email: string, name: string) => {
    const subject = `Update from BrandingBeez Newsletter`;
    const body = `Hi ${name},\n\nThank you for subscribing to our newsletter. We appreciate your interest in staying updated with our latest insights and tips.\n\nBest regards,\nBrandingBeez Team`;
    window.open(
      `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`
    );
  };

  const handleCopyEmail = (email: string, id: number) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportToCSV = () => {
    if (subscribers.length === 0) {
      alert("No subscribers to export");
      return;
    }

    const csv = [
      ["Name", "Email", "Subscribed Date"],
      ...filteredSubscribers.map((s: NewsletterSubscriber) => [
        s.name,
        s.email,
        new Date(s.subscribedAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscribers</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading subscribers...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Newsletter Subscribers ({(subscribers as NewsletterSubscriber[]).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters and Export */}
          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search subscribers by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="gap-2"
              disabled={filteredSubscribers.length === 0}
            >
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>

          {/* Subscribers List */}
          <div className="space-y-4">
            {filteredSubscribers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? "No subscribers match your search"
                  : "No newsletter subscribers yet"}
              </div>
            ) : (
              filteredSubscribers.map((subscriber: NewsletterSubscriber) => (
                <Card
                  key={subscriber.id}
                  className="border-l-4 border-l-green-500"
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      {/* Subscriber Info */}
                      <div className="lg:col-span-2">
                        <h3 className="font-semibold text-lg mb-2">
                          {subscriber.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="break-all">{subscriber.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(
                                subscriber.subscribedAt
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="lg:col-span-1 flex flex-col justify-center">
                        <Badge className="w-fit bg-green-100 text-green-800 hover:bg-green-100">
                          Active Subscriber
                        </Badge>
                        <p className="text-xs text-gray-500 mt-2">
                          Subscribed{" "}
                          {Math.floor(
                            (new Date().getTime() -
                              new Date(subscriber.subscribedAt).getTime()) /
                              (1000 * 60 * 60 * 24)
                          )}{" "}
                          days ago
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-1 flex flex-col gap-2">
                        <Button
                          onClick={() =>
                            handleCopyEmail(subscriber.email, subscriber.id)
                          }
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          {copiedId === subscriber.id ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Email
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() =>
                            handleEmailSubscriber(
                              subscriber.email,
                              subscriber.name
                            )
                          }
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Email
                        </Button>
                        <Button
                          onClick={() => {
                            if (
                              window.confirm(
                                `Are you sure you want to delete ${subscriber.name}? This action cannot be undone.`
                              )
                            ) {
                              deleteSubscriberMutation.mutate(subscriber.id);
                            }
                          }}
                          size="sm"
                          variant="destructive"
                          className="w-full"
                          disabled={deleteSubscriberMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deleteSubscriberMutation.isPending
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
