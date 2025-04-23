/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  PanelLeft,
  Plus,
  LogOut,
  ArrowUpDown,
  Trash2,
  Loader2
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  getChats,
  deleteChat,
  logout,
  sendFeedback
} from "@/features/Authentication/services/axios.service";
import { toast, useUser } from "@/hooks";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaQuestion } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function AppSidebar() {
  const { isAuthenticated, user } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignoutLoading, setIsSignoutLoading] = useState(false);
  const width = isExpanded ? "w-64" : "w-16";
  const [chats, setChats] = useState<{ chat_id: string; title: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getChats();
        setChats(
          data.history.map((h: any) => ({ chat_id: h.chat_id, title: h.title }))
        );
      } catch (error) {
        console.error("Failed to fetch chats", error);
      }
    })();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteChat(id);
      setChats((prev) => prev.filter((c) => c.chat_id !== id));
    } catch (error) {
      console.error("Error deleting chat", error);
    }
  };

  const handleLogout = async () => {
    setIsSignoutLoading(true);
    try {
      const logoutResponse = await logout();
      if (logoutResponse.statusText === "OK")
        toast({
          title: "Logged out successfully"
        });

      navigate("/auth", { replace: true });
      window.location.reload();
      toast({
        title: "Logged out successfully"
      });
    } catch (error) {
      console.error("Error logging out", error);
    } finally {
      setIsSignoutLoading(false);
    }
  };

  const onFeedbackSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await sendFeedback(feedback);
      if (response.statusText === "OK") {
        toast({
          title: "Feedback submitted successfully"
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to submit feedback", error);
      toast({
        title: "Failed to submit feedback"
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
    setFeedback("");
  };

  return (
    <div className={`shrink-0 transition-all duration-300 ${width}`}>
      <Sidebar className={`h-full ${width}`}>
        <SidebarContent className="h-full bg-gray-100 dark:bg-main-black flex flex-col justify-between">
          <div>
            {!isExpanded && (
              <Link to={"/"}>
                <img src="/logo.png" className="h-10 w-10 mx-auto mt-2" />
              </Link>
            )}
            <div className="flex items-center justify-between py-5 pr-5 mx-5">
              {isExpanded && <img src="/logo.png" className="h-10 w-10" />}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
              >
                <PanelLeft
                  className={`h-5 w-5 transition-transform duration-300 ease-in-out ${
                    isExpanded ? "rotate-180 -mr-16" : ""
                  }`}
                />
              </button>
            </div>

            {isExpanded ? (
              <Link to={"/"}>
                <Button
                  variant={"outline"}
                  className="w-[calc(100%-1.5rem)] mx-3 transition-all duration-300 hover:bg-primary/10 hover:scale-105"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="size-5 transition-transform duration-300 group-hover:rotate-90" />
                    New Chat
                  </span>
                </Button>
              </Link>
            ) : (
              <Link to={"/"}>
                <Button
                  variant={"outline"}
                  className="size-10 ml-3 transition-all duration-300 hover:scale-110 hover:bg-primary/10 overflow-hidden"
                >
                  <Plus className="scale-[1.3] transition-transform duration-300 hover:rotate-90" />
                </Button>
              </Link>
            )}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    {isAuthenticated ? (
                      <SidebarMenuButton asChild className="">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className={`group transition-all duration-300 hover:scale-105 ${
                                isExpanded &&
                                "w-[calc(100%-1.5rem)] mx-3 social-button"
                              }`}
                            >
                              <FaQuestion className="size-6 transition-transform duration-300 group-hover:rotate-12 group-hover:text-primary" />
                              {isExpanded && (
                                <span className="transition-opacity duration-300">
                                  Feedback
                                </span>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle className="text-sidebar-primary-foreground">
                                Feedback !
                              </DialogTitle>
                              <DialogDescription>
                                Tell us what you think about this app
                              </DialogDescription>
                              <Textarea
                                placeholder="Your thoughts"
                                className="text-sidebar-primary-foreground"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                              />
                            </DialogHeader>
                            <DialogFooter>
                              <Button onClick={onFeedbackSubmit}>
                                {isLoading ? (
                                  <Loader2 className="animate-spin" />
                                ) : (
                                  "Submit"
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </SidebarMenuButton>
                    ) : null}
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {isExpanded && (
              <div className=" my-3 mx-3 w-[calc(100%-1.5rem)] border-t border-dashed border-t-gray-300 dark:border-t-gray-700" />
            )}

            {isExpanded && isAuthenticated && (
              <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
            )}

            {isExpanded && (
              <div className="flex flex-col gap-2 px-3 w-full">
                {chats.map((chat) => (
                  <div key={chat.chat_id} className="flex gap-2 items-center">
                    <Link to={`/chat/${chat.chat_id}`} className="flex-1">
                      <Button variant="ghost" className="w-full justify-start">
                        {chat.title}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(chat.chat_id)}
                    >
                      <Trash2 className="text-red-400" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className=" flex flex-col items-center gap-4">
            {isAuthenticated ? (
              <Popover>
                <PopoverTrigger asChild className="mx-4 mb-4">
                  <div className="cursor-pointer flex items-center gap-4">
                    <Avatar className="">
                      <AvatarImage src={user.profilePicture} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((word: string[]) => word[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isExpanded && (
                      <div className="flex flex-col">
                        <h2 className="flex items-center gap-4">
                          <span>{user.name}</span>{" "}
                          <ArrowUpDown className="h-4 w-4 text-gray-400" />
                        </h2>
                        <span className="text-xs text-gray-400 mb-">Free</span>
                      </div>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <p className="leading-none text-sm text-gray-400">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-4">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.profilePicture}
                            alt={user.name}
                          />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((word: string[]) => word[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                          <h2 className="flex items-center gap-4">
                            <span>{user.name}</span>
                          </h2>
                          <span className="text-xs text-gray-400 mb-">
                            Free
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Button
                        variant="outline"
                        className="pb-2 w-full"
                        onClick={handleLogout}
                      >
                        {isSignoutLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <LogOut />
                        )}

                        <h2 className=" flex-shrink-0">Sign Out</h2>
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Link
                to={"/auth"}
                className="flex justify-between w-full pb-2 items-center"
              >
                <div className=" size-10 bg-gradient-to-br from-blue-700 to-green-500 ml-3 rounded-lg" />

                {isExpanded && <span />}
              </Link>
            )}
          </div>
        </SidebarContent>
      </Sidebar>
    </div>
  );
}
