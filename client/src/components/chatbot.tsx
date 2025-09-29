import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: number;
  type: "user" | "bot";
  content: string;
  recommendations?: string[];
  timestamp: Date;
}

interface ChatSession {
  id: number;
  sessionId: string;
  messages: Message[];
  clientInfo: any;
  recommendations: any;
  createdAt: Date;
  updatedAt: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate session ID on mount
  useEffect(() => {
    if (!sessionId) {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
    }
  }, [sessionId]);

  // Create chat session when opening for the first time
  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: { sessionId: string; clientInfo: any }) => {
      return apiRequest("/api/chat", "POST", {
        message: "Hello",
        sessionId: sessionData.sessionId,
        clientInfo: sessionData.clientInfo
      });
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { sessionId: string; message: string }) => {
      return apiRequest("/api/chat", "POST", {
        message: data.message,
        sessionId: data.sessionId,
        clientInfo: {
          userAgent: navigator.userAgent,
          timestamp: new Date(),
          url: window.location.href
        }
      });
    },
    onSuccess: () => {
      refetch();
      setMessage("");
      scrollToBottom();
    }
  });

  // Get chat session
  const { data: session, refetch } = useQuery<{ success: boolean; session: ChatSession }>({
    queryKey: [`/api/chat/sessions/${sessionId}`],
    enabled: !!sessionId && isOpen,
    retry: false
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.session?.messages]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    
    if (sessionId && !session) {
      createSessionMutation.mutate({
        sessionId,
        clientInfo: {
          userAgent: navigator.userAgent,
          timestamp: new Date(),
          url: window.location.href
        }
      });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && sessionId) {
      sendMessageMutation.mutate({
        sessionId,
        message: message.trim()
      });
    }
  };

  const handleRecommendationClick = (recommendation: string) => {
    let messageText = "";
    switch (recommendation) {
      case "seo-services":
        messageText = "Tell me more about your SEO services";
        break;
      case "free-seo-audit":
        messageText = "I'd like a free SEO audit";
        break;
      case "web-development":
        messageText = "I need website development";
        break;
      case "dedicated-resources":
        messageText = "Tell me about dedicated resources";
        break;
      case "pricing-consultation":
        messageText = "I'd like to discuss pricing";
        break;
      default:
        messageText = "Tell me more about this service";
    }
    setMessage(messageText);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleOpen}
          size="lg"
          className="bg-brand-coral rand-coral/90 text-white rounded-full w-16 h-16 shadow-lg  "
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <div className="absolute -top-2 -left-2">
          <Badge className="bg-green-500 text-white animate-bounce">
            Chat Now!
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-xl border-2 border-brand-coral/20 
        isMinimized ? "h-16" : "h-[600px]"
      }`}>
        <CardHeader className="bg-gradient-to-r from-brand-coral to-brand-purple text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <CardTitle className="text-lg">BrandingBeez Assistant</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hite/20"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hite/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {!isMinimized && (
            <p className="text-sm text-white/90">
              Ask me about our services and get instant recommendations!
            </p>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-[520px] p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {session?.session?.messages && session.session.messages.length > 0 ? (
                session.session.messages.map((msg: Message) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.type === "user"
                          ? "bg-brand-coral text-white"
                          : "bg-white border border-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.type === "bot" && <Bot className="w-4 h-4 mt-1 text-brand-coral" />}
                        {msg.type === "user" && <User className="w-4 h-4 mt-1" />}
                        <div className="flex-1">
                          <p className="text-sm">{msg.content}</p>
                          {msg.recommendations && msg.recommendations.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {msg.recommendations.map((rec: string, index: number) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleRecommendationClick(rec)}
                                  className="text-xs border-brand-coral/30 text-brand-coral rand-coral hite"
                                >
                                  {rec.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 mt-8">
                  <Bot className="w-12 h-12 mx-auto mb-4 text-brand-coral" />
                  <p className="text-sm">
                    Hi! I'm here to help you find the perfect service for your business.
                    Ask me anything about our offerings!
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about our services..."
                  disabled={sendMessageMutation.isPending}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="bg-brand-coral rand-coral/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}