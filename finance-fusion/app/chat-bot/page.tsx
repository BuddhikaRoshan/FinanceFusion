"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Mic, StopCircle } from "lucide-react";
import { getExpensesByUserId } from "@/services/expense.service";
import { getIncomesByUserId } from "@/services/income.service";
import { Expense, Income } from "@prisma/client";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

// Voice recognition setup
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

if (!apiKey) {
  throw new Error(
    "API key is missing. Please set the NEXT_PUBLIC_OPENAI_API_KEY in .env."
  );
}

interface MessageProps {
  message: { role: string; content: string };
  isUser: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isUser }) => (
  <div
    className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"} mb-4`}
  >
    {!isUser && (
      <Avatar className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="text-xs font-bold text-white">AI</div>
      </Avatar>
    )}
    <div
      className={`p-3 rounded-lg max-w-[80%] ${
        isUser
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
          : "bg-gray-700 text-gray-100"
      }`}
    >
      {message.content}
    </div>
    {isUser && (
      <Avatar className="h-8 w-8 bg-gray-600">
        <div className="text-xs font-bold text-white">You</div>
      </Avatar>
    )}
  </div>
);

const ChatbotPage = () => {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [messages, setMessages] = useState<
    { role: "assistant" | "user"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hello! I'm FinanceFusion, an AI assistant powered by OpenAI. How can I help you with your finances today?",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const setData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      const [expenses, incomes] = await Promise.all([
        getExpensesByUserId(userId),
        getIncomesByUserId(userId),
      ]);
      setIncomes(incomes);
      setExpenses(expenses);
    } catch (error) {
      toast.error("Failed to load financial data");
      console.error(error);
    }
  };

  useEffect(() => {
    setData();
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-US";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          toast.error("Voice recognition failed. Please try again.");
        };
      } else {
        console.warn("Speech recognition not supported in this browser");
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Choose your preferred model (gpt-3.5-turbo, gpt-4, etc.)
      const model = "gpt-4"; // or "gpt-3.5-turbo" for faster responses

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              {
                role: "system",
                content: `You are FinanceFusion, a helpful financial assistant. 
                The user's financial data:
                Incomes: ${JSON.stringify(incomes)}
                Expenses: ${JSON.stringify(expenses)}
                Provide concise, actionable advice based on their financial situation.`,
              },
              ...messages,
              userMessage,
            ],
            temperature: 0.7,
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, data.choices[0].message]);
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Navbar />
      <div className="container mx-auto p-4 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-2xl bg-gray-800 border-gray-700 shadow-xl">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-xl text-white">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                FinanceFusion AI
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 h-[500px]">
            <ScrollArea className="h-full p-4">
              {messages.map((message, index) => (
                <Message
                  key={index}
                  message={message}
                  isUser={message.role === "user"}
                />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <Avatar className="h-8 w-8 mr-3 bg-gradient-to-r from-blue-500 to-purple-600">
                    <div className="text-xs font-bold text-white">AI</div>
                  </Avatar>
                  <div className="p-3 rounded-lg bg-gray-700">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ScrollArea>
          </CardContent>

          <CardFooter className="border-t border-gray-700 p-4">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <div className="relative flex-grow">
                <Input
                  placeholder={
                    isListening
                      ? "Listening... Speak now"
                      : "Type your message..."
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading || isListening}
                  className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                />
                <Button
                  type="button"
                  onClick={toggleVoiceInput}
                  variant="ghost"
                  size="icon"
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 ${
                    isListening ? "text-red-500" : "text-gray-400"
                  }`}
                  disabled={isLoading}
                >
                  {isListening ? (
                    <StopCircle className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim() || isListening}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Send"
                )}
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChatbotPage;
