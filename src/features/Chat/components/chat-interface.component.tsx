import { useState, useEffect, useContext, useRef, KeyboardEvent } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUp, Code2, Loader2 } from "lucide-react";
import { useEditorStore } from "@/store/editor.store";
import { toast } from "@/hooks/use-toast";
import { ChatMessage } from ".";
import {
  getMessages,
  sendMessage
} from "@/features/Authentication/services/axios.service";
import { v4 as uuidv4 } from "uuid";
import Prompt from "@/constants/Prompt";
import { EditorMessageContext } from "@/store/editor-message.context";
import { useUser } from "@/hooks";
import { MessageContext } from "@/store/message.store";

interface Message2 {
  id: string;
  prompt?: string;
  response?: string;
  code?: string;
  isLoading?: boolean;
  likes?: number;
  dislikes?: number;
}

interface ChatInterfaceProps {
  isMobile: boolean;
  chatTitle?: string;
  onInputChange?: (input: string) => void;
  onEnter?: (input: string) => void; // <-- NEW
}

export function ChatInterface({
  isMobile,
  onInputChange,
  onEnter
}: ChatInterfaceProps) {
  const { isAuthenticated } = useUser();
  const [messages, setMessages] = useState<Message2[]>([]);
  const { message } = useContext(MessageContext);
  const { editorMessage, setEditorMessage } = useContext(EditorMessageContext);
  const [input, setInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleEditor, isEditorOpen } = useEditorStore();
  const [likedMessages, setLikedMessages] = useState<Set<number>>(new Set());
  const [dislikedMessages, setDislikedMessages] = useState<Set<number>>(
    new Set()
  );
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { chat_id } = useParams();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Make sure to call scrollToBottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Process messages received from backend to clean up the prompts
  const processMessages = (messages: Message2[]): Message2[] => {
    return messages.map((message) => {
      if (message.prompt) {
        // Extract only the actual user input by removing any system prompts
        // Strip the "You are AI Assistant..." part and all other system instructions
        const systemPromptPatterns = [
          /You are an? AI Assistant[^.]*.{0,500}GUIDELINES:.{0,1000}/s,
          /You are an? AI[^.]*.{0,200}GUIDELINES:.{0,1000}/s,
          /GUIDELINES:.{0,1000}/s,
          /You are a[^.]*.{0,500}/s,
          /PLEASE[^.]*.{0,300}/s,
          Prompt.CHAT_PROMPT
        ];

        let cleanPrompt = message.prompt;
        systemPromptPatterns.forEach((pattern) => {
          cleanPrompt = cleanPrompt.replace(pattern, "");
        });

        return {
          ...message,
          prompt: cleanPrompt.trim()
        };
      }
      return message;
    });
  };

  useEffect(() => {
    setIsLoading(true);
    if (chat_id) {
      (async () => {
        try {
          setIsLoading(true);
          const { data } = await getMessages(chat_id!);
          // Process the messages to clean up prompts before setting them
          setMessages(processMessages(data.chat_messages || []));
        } catch (error) {
          console.error("Error fetching messages", error);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [chat_id, editorMessage, setEditorMessage]);

  useEffect(() => {
    if (!isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  const handleSend = async () => {
    // If user not authenticated, allow only 1 message
    if (!isAuthenticated && messages.length > 0) {
      window.location.href = "/auth";
      return;
    }

    // Create the payload with the full prompt (user input + system prompt)
    const payload = {
      chat_id,
      prompt: input + Prompt.CHAT_PROMPT
    };

    // But for the UI, only use the user's actual input
    const userMessage: Message2 = { id: uuidv4(), prompt: input };

    // Optimistic message with loading flag set
    const assistantMessage: Message2 = {
      id: uuidv4(),
      response: "",
      isLoading: true,
      likes: 0,
      dislikes: 0
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");

    try {
      await sendMessage(payload);
      if (chat_id) {
        // Fetch and process the updated messages
        const { data } = await getMessages(chat_id);
        setMessages(processMessages(data.chat_messages || []));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? {
                ...msg,
                response:
                  "We are bringing the mentioned change. Hang Tight ...",
                isLoading: false
              }
            : msg
        )
      );
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (input.trim()) {
        handleSend();
        if (onEnter) {
          onEnter(input); // <- Trigger parent-defined function
        }
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setIsActive(newValue !== "");
    setInput(newValue);

    if (onInputChange) {
      onInputChange(newValue);
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "The message has been copied to your clipboard."
    });
  };

  const handleRetry = () => {
    // Implement retry logic here
    toast({
      title: "Retry",
      description: "Retrying the last message..."
    });
  };

  const handleLike = (index: number) => {
    setLikedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
    setDislikedMessages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    toast({
      title: "Feedback Received",
      description: "Thank you for your feedback!"
    });
  };

  const handleDislike = (index: number) => {
    setDislikedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
    setLikedMessages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
    toast({
      title: "Feedback Received",
      description: "We're sorry to hear that. We'll work on improving."
    });
  };

  if (isLoading) {
    return (
      <h2 className="flex items-center justify-center gap-2 h-screen">
        <span>Loading</span> <Loader2 className="animate-spin h-6 w-6 mr-2" />
      </h2>
    );
  }

  return (
    <div className="flex flex-col h-full items-center text-black dark:text-white bg-white dark:bg-dim-black">
      <div className="flex justify-between gap-5 items-center p-4 w-full">
        <h1 className="font-medium">{message?.prompt}</h1>
        {!isMobile && (
          <Button variant="outline" size="sm" onClick={toggleEditor}>
            <Code2 className="mr-2 h-4 w-4" />
            {isEditorOpen ? "Hide Editor" : "Show Editor"}
          </Button>
        )}
      </div>

      <ScrollArea
        className="flex-grow w-full max-w-3xl mx-auto px-4"
        ref={scrollAreaRef}
      >
        {messages.map((message, index) => (
          <>
            <ChatMessage
              key={index}
              message={message}
              onCopy={() => handleCopy(message.code || message.response || "")}
              onRetry={handleRetry}
              onLike={() => handleLike(index)}
              onDislike={() => handleDislike(index)}
              isLiked={likedMessages.has(index)}
              isDisliked={dislikedMessages.has(index)}
            />
          </>
        ))}
        {/* Add this div at the end of messages */}
        <div ref={messagesEndRef} />
        {/* {isEditLoading ? (
          <div className="flex items-center justify-center gap-2 h-16">
            <span>We are Editing your project. Please Wait!</span>
            <Loader2 className="animate-spin h-6 w-6 mr-2" />
          </div>
        ) : null} */}
      </ScrollArea>

      <div className="w-full max-w-3xl mx-auto px-4 mb-4 border border-gray-700 rounded-lg">
        <input
          type="text"
          placeholder="Devdistruct, use this image to create something amazing!"
          className="p-3 pb-1.5 w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0"
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          value={input}
          disabled={isLoading}
        />
        <div className="h-[52px] w-full p-3 flex justify-between">
          <span />
          <Button
            disabled={!isActive || isLoading}
            className="size-7 p-0"
            onClick={handleSend}
          >
            <ArrowUp />
          </Button>
        </div>
      </div>
    </div>
  );
}
