import { useState } from "react";
import { deleteChat } from "@/features/Authentication/services";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteChatDialogProps {
  chatId: string;
  chatTitle: string;
  onDeleteSuccess: () => void;
}

export const DeleteChatDialog = ({
  chatId,
  chatTitle,
  onDeleteSuccess
}: DeleteChatDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteChat(chatId);

      // Update localStorage to remove the chat_id
      const storedChats = localStorage.getItem("chats");
      if (storedChats) {
        const chatsArray = JSON.parse(storedChats);
        const updatedChats = chatsArray.filter((id: string) => id !== chatId);
        localStorage.setItem("chats", JSON.stringify(updatedChats));
      }

      toast.success("Chat deleted successfully");
      onDeleteSuccess();
    } catch (error) {
      console.error("Failed to delete chat:", error);
      toast.error("Failed to delete chat. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-100/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Chat</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{chatTitle}"? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
