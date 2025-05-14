import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, ThumbsUp, ThumbsDown, RefreshCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: {
    prompt?: string;
    response?: string;
    code?: string;
    isLoading?: boolean;
    likes?: number;
    dislikes?: number;
  };
  onCopy: () => void;
  onRetry: () => void;
  onLike: () => void;
  onDislike: () => void;
  isLiked: boolean;
  isDisliked: boolean;
}

export function ChatMessage({
  message,
  onCopy,
  onRetry,
  onLike,
  onDislike,
  isLiked,
  isDisliked
}: ChatMessageProps) {
  // Function to extract text from code responses that might be in JSON format
  const extractTextFromResponse = (response: string | undefined): string => {
    if (!response) return "";

    // Check if the response looks like a JSON object (starts with '{')
    if (response.trim().startsWith("{")) {
      try {
        // Try to parse it as JSON
        const jsonObj = JSON.parse(response);

        // If it's a JSON object with a file structure
        if (typeof jsonObj === "object") {
          // Try to find the first file with code
          for (const key in jsonObj) {
            if (jsonObj[key]?.code) {
              const codeContent = jsonObj[key].code;

              // If the code content starts and ends with quotes, remove them
              if (
                typeof codeContent === "string" &&
                codeContent.startsWith('"') &&
                codeContent.endsWith('"')
              ) {
                return codeContent.slice(1, -1);
              }

              return codeContent.toString();
            }
          }
        }
        // If we couldn't extract, return original
        return response;
      } catch (e) {
        console.log("JSON parse error (expected for plain text):", e);
        // If it's not valid JSON, just return the original response
        return response;
      }
    } else {
      // If it doesn't look like JSON, return it as is
      return response;
    }
  };

  // Function to clean system prompts from user messages
  const cleanUserPrompt = (prompt: string | undefined): string => {
    if (!prompt) return "";

    // Remove all the system prompts and instructions
    // Strip the "You are AI Assistant..." part and all other system instructions
    const systemPromptPatterns = [
      /You are an? AI Assistant[^.]*.{0,500}GUIDELINES:.{0,1000}/s,
      /You are an? AI[^.]*.{0,200}GUIDELINES:.{0,1000}/s,
      /GUIDELINES:.{0,1000}/s,
      /You are a[^.]*.{0,500}/s,
      /PLEASE[^.]*.{0,300}/s
    ];

    let cleaned = prompt;
    systemPromptPatterns.forEach((pattern) => {
      cleaned = cleaned.replace(pattern, "");
    });

    return cleaned.trim();
  };

  // Determine role based on presence of a response; if response exists, use assistant avatar
  const isAssistant = !!message.response;

  // Process the response text if it's from the assistant
  const displayResponse = isAssistant
    ? extractTextFromResponse(message.response)
    : message.response;

  // Clean the user prompt to remove system instructions
  const displayPrompt = cleanUserPrompt(message.prompt || "");

  return (
    <div
      className={`flex overflow-scroll scrollbar-hide ${
        isAssistant ? "mb-6" : "mb-2"
      } w-full`}
    >
      <div className="flex flex-col ml-2 w-full">
        <div
          className={`rounded-lg px-3 py-1 text-sm max-w-[80%] ${
            isAssistant
              ? "bg-secondary text-secondary-foreground"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {/* Render prompt if available - use the clean display prompt */}
          {displayPrompt && (
            <div className="mb-4 flex gap-4 items-center border-b border-b-slate-600 pb-2 w-full">
              <Avatar className="size-6 text-xs mt-1">
                <AvatarFallback>U</AvatarFallback>
                <AvatarImage src="/user-avatar.png" />
              </Avatar>
              {displayPrompt}
            </div>
          )}
          {/* Render response if available or loading indicator */}
          {message.isLoading ? (
            <div className="loader flex-shrink-0 min-w-fit">
              <div className="circle">
                <div className="dot" />
                <div className="outline" />
              </div>
              <div className="circle">
                <div className="dot" />
                <div className="outline" />
              </div>
              <div className="circle">
                <div className="dot" />
                <div className="outline" />
              </div>
              <div className="circle">
                <div className="dot" />
                <div className="outline" />
              </div>
            </div>
          ) : (
            message.response && (
              <div className="flex gap-4">
                <Avatar className="size-6 text-xs mt-1">
                  <AvatarFallback>A</AvatarFallback>
                  <AvatarImage src="/assistant-avatar.png" />
                </Avatar>
                <ReactMarkdown className="markdown-body">
                  {displayResponse}
                </ReactMarkdown>
              </div>
            )
          )}
        </div>
        {/* Render action buttons for assistant messages */}
        {isAssistant && !message.isLoading && (
          <div className="flex mt-2 space-x-2">
            <Button variant="outline" size="sm" onClick={onCopy}>
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCcw className="h-4 w-4 mr-1" />
              Retry
            </Button>
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={onLike}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
            </Button>
            <Button
              variant={isDisliked ? "default" : "outline"}
              size="sm"
              onClick={onDislike}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
