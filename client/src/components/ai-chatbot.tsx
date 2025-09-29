import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  X, 
  Minus, 
  Send, 
  Bot, 
  User,
  Maximize2,
  Minimize2,
  Calendar,
  Upload,
  FileText,
  Image,
  Video,
  FileCheck
} from "lucide-react";

interface Message {
  id: number;
  type: "user" | "bot" | "analysis";
  content: string;
  recommendations?: string[];
  timestamp: Date;
  documentAnalysis?: {
    analysis: string;
    recommendations: string[];
    serviceRecommendations: {
      service: string;
      description: string;
      pricing: string;
      cta: string;
    }[];
    actionItems: string[];
  };
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

interface ChatState {
  step: 'initial' | 'name_capture' | 'email_capture' | 'challenge_capture' | 'conversation';
  userName: string;
  userEmail: string;
  userChallenge: string;
  hasAskedQuestion: boolean;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionId] = useState(`chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [chatState, setChatState] = useState<ChatState>({
    step: 'initial',
    userName: '',
    userEmail: '',
    userChallenge: '',
    hasAskedQuestion: false
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get or create chat session
  const { data: session, refetch } = useQuery<{ success: boolean; session: ChatSession }>({
    queryKey: [`/api/chat/sessions/${sessionId}`],
    enabled: isOpen,
    retry: false
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await apiRequest("/api/chat", "POST", {
        message: userMessage,
        sessionId: session?.session?.sessionId || sessionId,
        clientInfo: {
          userAgent: navigator.userAgent,
          timestamp: new Date(),
          url: window.location.href,
          leadInfo: {
            name: chatState.userName,
            email: chatState.userEmail,
            challenge: chatState.userChallenge
          }
        }
      });
      return response;
    },
    onSuccess: () => {
      refetch();
      setMessage("");
      scrollToBottom();
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (session?.session?.messages) {
      scrollToBottom();
    }
  }, [session?.session?.messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (message.trim() && !sendMessageMutation.isPending && !isAnalyzing) {
      processConversationStep(message.trim());
    }
  };

  const processConversationStep = (userInput: string) => {
    // Let the AI handle the conversation flow intelligently
    // Just send the raw user input - no more rigid step processing
    sendMessageMutation.mutate(userInput);
  };

  const handleQuickAction = (action: string) => {
    let messageText = "";
    switch (action) {
      case "seo-services":
        messageText = "I'm interested in SEO services";
        break;
      case "web-development":
        messageText = "I need help with web development";
        break;
      case "google-ads":
        messageText = "I want to improve my Google Ads";
        break;
      case "automation":
        messageText = "I'm looking for business automation solutions";
        break;
      case "consultation":
        messageText = "I'd like to discuss my business needs";
        break;
      default:
        messageText = "I want to learn about your services";
    }
    setMessage(messageText);
    processConversationStep(messageText);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setIsAnalyzing(true);

      try {
        // Convert file to base64 for API
        const fileReader = new FileReader();
        const fileData = await new Promise<string>((resolve, reject) => {
          fileReader.onload = (e) => resolve(e.target?.result as string);
          fileReader.onerror = reject;
          fileReader.readAsDataURL(file);
        });

        // Extract base64 content
        const base64Content = fileData.split(',')[1];

        // Determine file type
        let fileType: 'image' | 'pdf' | 'document' | 'video' = 'document';
        if (file.type.startsWith('image/')) fileType = 'image';
        else if (file.type.startsWith('video/')) fileType = 'video';
        else if (file.type === 'application/pdf') fileType = 'pdf';

        const response = await fetch("/api/chat/analyze", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileData: {
              type: fileType,
              content: base64Content,
              fileName: file.name,
              mimeType: file.type
            },
            sessionId: session?.session?.sessionId || sessionId,
            clientInfo: {
              userAgent: navigator.userAgent,
              timestamp: new Date(),
              url: window.location.href,
              leadInfo: {
                name: chatState.userName,
                email: chatState.userEmail,
                challenge: chatState.userChallenge
              }
            }
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Refetch to get updated session with analysis
        refetch();
      } catch (error) {
        console.error("Error analyzing document:", error);
        // Show error message to user
        sendMessageMutation.mutate(`I encountered an error analyzing "${file.name}". Could you try uploading it again or describe what's in the document?`);
      } finally {
        setIsAnalyzing(false);
        // Clear the file input value to allow uploading the same file again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const getInputPlaceholder = () => {
    switch (chatState.step) {
      case 'initial':
        return "Ask me anything about our services...";
      case 'name_capture':
        return "What's your name?";
      case 'email_capture':
        return "What's your email address?";
      case 'challenge_capture':
        return "What's your biggest business challenge?";
      case 'conversation':
        return "Continue the conversation...";
      default:
        return "Type your message...";
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 shadow-lg transition-all duration-300"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        <div className="absolute -top-3 -left-3">
          <img 
            src="/images/vignesh-founder.webp" 
            alt="Vig - Click to chat" 
            className="w-10 h-10 rounded-full object-cover border-3 border-white shadow-lg animate-bounce cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96">
      <Card className="shadow-2xl border-t-4 border-t-blue-500">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="/images/vignesh-founder.webp" 
                alt="Vig - Founder" 
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
              <h3 className="font-semibold">BrandingBeez AI</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 p-1 h-auto"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {!isMinimized && (
            <p className="text-sm text-white/90">
              {chatState.userName ? `Hi ${chatState.userName}! 👋` : "Let's grow your business together! 🚀"}
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
                      className={`max-w-[85%] rounded-lg p-3 ${
                        msg.type === "user"
                          ? "bg-blue-600 text-white"
                          : msg.type === "analysis" 
                            ? "bg-green-500 text-white" 
                            : "bg-white border border-gray-200 text-gray-800 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {msg.type === "bot" && <Bot className="w-4 h-4 mt-1 text-blue-600 flex-shrink-0" />}
                        {msg.type === "analysis" && <FileCheck className="w-4 h-4 mt-1 text-white flex-shrink-0" />}
                        {msg.type === "user" && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                        <div className="flex-1">
                          <div className="text-sm whitespace-pre-line leading-relaxed">
                            {msg.content.split('\n').map((line, index) => (
                              <div key={index} className={`${line.trim().startsWith('•') ? 'ml-2' : ''}`}>
                                {line}
                              </div>
                            ))}
                          </div>

                          {/* Display Document Analysis Details */}
                          {msg.documentAnalysis && msg.documentAnalysis.serviceRecommendations && msg.documentAnalysis.serviceRecommendations.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <h5 className="font-semibold text-sm">Our Services for You:</h5>
                              {msg.documentAnalysis.serviceRecommendations.map((rec, index) => (
                                <div key={index} className="border-t pt-2 last:border-b-0">
                                  <p className="font-medium text-xs">{rec.service}</p>
                                  <p className="text-xs text-gray-700 mb-1">{rec.description}</p>
                                  <p className="text-xs text-gray-500 mb-2">Pricing: {rec.pricing}</p>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      // Handle CTA action, e.g., open booking, navigate, etc.
                                      // For now, let's assume it's a link to book a meeting or contact
                                      if (rec.cta.includes('calendly.com')) {
                                        window.open(rec.cta, '_blank');
                                      } else {
                                        setMessage(rec.cta); // Set as message to send or display
                                        processConversationStep(rec.cta); // Or process as conversation step
                                      }
                                    }}
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs w-full"
                                  >
                                    {rec.cta.includes('calendly.com') ? <Calendar className="w-3 h-3 mr-1" /> : <Send className="w-3 h-3 mr-1" />}
                                    {rec.cta.includes('calendly.com') ? 'Book a Meeting' : 'Learn More'}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Display Action Items */}
                          {msg.documentAnalysis && msg.documentAnalysis.actionItems && msg.documentAnalysis.actionItems.length > 0 && (
                            <div className="mt-3 space-y-1">
                              <h5 className="font-semibold text-sm">Action Items:</h5>
                              {msg.documentAnalysis.actionItems.map((item, index) => (
                                <Badge key={index} variant="outline" className="text-xs mr-1 mb-1 border-blue-400 text-blue-700">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Display general recommendations */}
                          {msg.recommendations && msg.recommendations.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {msg.recommendations.map((rec, index) => (
                                <div key={index}>
                                  {rec.includes('calendly.com') ? (
                                    <Button
                                      size="sm"
                                      onClick={() => window.open(rec, '_blank')}
                                      className="bg-green-600 hover:bg-green-700 text-white text-xs w-full"
                                    >
                                      <Calendar className="w-3 h-3 mr-1" />
                                      Book a Meeting with Vig
                                    </Button>
                                  ) : (
                                    <Badge 
                                      variant="outline" 
                                      className="text-xs cursor-pointer hover:bg-blue-50 border-blue-200 mr-1 mb-1"
                                      onClick={() => setMessage(rec)}
                                    >
                                      {rec}
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Bot className="w-12 h-12 text-blue-400 mb-4" />
                  <h4 className="font-medium text-gray-800 mb-2">👋 Hi there! I'm Vig</h4>
                  <p className="text-sm text-gray-600 mb-4 px-4">
                    I'm here to help grow your business with our digital marketing services. What brings you here today?
                  </p>
                  {!chatState.hasAskedQuestion && (
                    <div className="grid grid-cols-2 gap-2 w-full px-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction("seo-services")}
                        className="text-xs"
                      >
                        🔍 SEO Help
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction("web-development")}
                        className="text-xs"
                      >
                        💻 Website
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction("google-ads")}
                        className="text-xs"
                      >
                        🎯 Google Ads
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction("consultation")}
                        className="text-xs"
                      >
                        💬 Let's Chat
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-gray-50">
              {isAnalyzing && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    <span className="text-sm text-blue-700">Analyzing your document...</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,.pdf,.doc,.docx,.txt,.csv,.xlsx,.ppt,.pptx"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  disabled={isAnalyzing}
                  className="shrink-0"
                  title="Upload document for analysis"
                >
                  <Upload className="w-4 h-4" />
                </Button>

                <Input
                  type="text"
                  placeholder={getInputPlaceholder()}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage(e)}
                  className="flex-1"
                  disabled={sendMessageMutation.isPending || isAnalyzing}
                />
                <Button 
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!message.trim() || sendMessageMutation.isPending || isAnalyzing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {sendMessageMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="mt-2 text-xs text-gray-500 text-center">
                📄 Upload images, videos, PDFs, or documents for instant analysis
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}