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
  // Determine role based on presence of a response; if response exists, use assistant avatar
  const isAssistant = !!message.response;

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
          {/* Render prompt if available */}
          {message.prompt && (
            <div className="mb-4 flex gap-4 items-center border-b border-b-slate-600 pb-2 w-full">
              <Avatar className="size-6 text-xs mt-1">
                <AvatarFallback>U</AvatarFallback>
                <AvatarImage src="/user-avatar.png" />
              </Avatar>
              {message.prompt}
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
                  {message.response}
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
