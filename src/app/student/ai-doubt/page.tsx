"use client";
import { useState, useRef, useEffect } from "react";
import { Bot, Send, ImageIcon, Mic, MicOff, Sparkles, X, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  inputType?: "text" | "image" | "voice";
  imageUrl?: string;
  timestamp: Date;
}

const subjectOptions = [
  { value: "", label: "All Subjects" },
  { value: "Mathematics", label: "Mathematics" },
  { value: "Science", label: "Science" },
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Marathi", label: "Marathi" },
  { value: "Social Science", label: "Social Science" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
];

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-9 h-9 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-white border border-slate-100 text-slate-800 shadow-sm rounded-bl-sm"
        )}
      >
        {message.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={message.imageUrl} alt="Question" className="rounded-xl mb-2 max-h-48 object-contain" />
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <p className={cn("text-xs mt-1", isUser ? "text-blue-200" : "text-slate-400")}>
          {message.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
      {isUser && (
        <div className="w-9 h-9 bg-slate-200 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-slate-600 font-bold text-sm">S</span>
        </div>
      )}
    </div>
  );
}

export default function AIDoubtSolverPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Namaste! 🙏 I'm your AI Doubt Solver, powered by Prem Sir's teaching philosophy.\n\nI can help you with:\n• 📖 Any subject doubts — Maths, Science, English, Hindi, SST\n• 🔢 Step-by-step math solutions\n• 🖼️ Image questions (take a photo of your textbook!)\n• 🎤 Voice questions\n\nAsk me anything! I'm here 24/7.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question && !selectedImage) return;
    if (loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question || "Please solve this question from the image.",
      inputType: selectedImage ? "image" : "text",
      imageUrl: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedImage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          subject: selectedSubject,
          conversationId,
          inputType: selectedImage ? "image" : "text",
          imageUrl: selectedImage || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI service error");
      }

      if (data.conversationId) setConversationId(data.conversationId);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: err instanceof Error
          ? err.message
          : "Sorry, I encountered an error. Please try again or contact your teacher.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceToggle = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast("Voice recording started... (Feature coming soon)", { icon: "🎤" });
      setTimeout(() => {
        setIsRecording(false);
        setInput("What is the difference between mitosis and meiosis?");
        toast.success("Voice captured!");
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

  const suggestedQuestions = [
    "Explain Newton's laws of motion with examples",
    "Solve: 2x² + 5x - 3 = 0",
    "What is photosynthesis? Explain step by step",
    "Explain the causes of World War I",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex-shrink-0 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                AI Doubt Solver
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h1>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-xs text-green-600 font-medium">Online • Powered by Prem Sir's knowledge</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select
              options={subjectOptions}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-sm w-40"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMessages([{
                  id: "welcome",
                  role: "assistant",
                  content: "New conversation started! What would you like to learn today? 📚",
                  timestamp: new Date(),
                }]);
                setConversationId(null);
              }}
            >
              New Chat
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-2 min-h-0">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-9 h-9 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-xs text-slate-400 ml-2">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {messages.length === 1 && (
        <div className="flex-shrink-0 mt-4 mb-2">
          <p className="text-xs text-slate-400 font-medium mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="text-xs px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image preview */}
      {selectedImage && (
        <div className="flex-shrink-0 relative inline-flex mt-2 ml-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={selectedImage} alt="Selected" className="h-20 rounded-xl border border-slate-200 object-cover" />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="flex-shrink-0 mt-3">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 flex items-end gap-2">
          <div className="flex gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              title="Upload image"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleVoiceToggle}
              className={cn(
                "p-2.5 rounded-xl transition-colors",
                isRecording
                  ? "bg-red-100 text-red-500"
                  : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
              )}
              title="Voice input"
            >
              {isRecording ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your doubt here... (Press Enter to send, Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none py-2 max-h-32 overflow-y-auto"
            style={{ lineHeight: "1.5" }}
          />

          <button
            onClick={handleSend}
            disabled={loading || (!input.trim() && !selectedImage)}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">
          AI can make mistakes. For important concepts, verify with your teacher.
        </p>
      </div>
    </div>
  );
}
