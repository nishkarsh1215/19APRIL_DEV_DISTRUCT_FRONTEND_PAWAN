/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEditorStore } from "@/store/editor.store";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle, Download } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { CodeEditor, ChatInterface } from "../components";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";
import { SandpackProvider, useSandpack } from "@codesandbox/sandpack-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChat, sendCodeMessage } from "@/features/Authentication/services";
import { Message, MessageContext } from "@/store/message.store";
import Prompt from "@/constants/Prompt";
import { FilesContext } from "@/store/file.store";
import { toast } from "sonner";

const DownloadButton = () => {
  const { sandpack } = useSandpack();

  const handleDownload = async () => {
    try {
      // Dynamically import JSZip to avoid bundling it unnecessarily
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Get all files from Sandpack
      const files = sandpack.files;

      // Add each file to the zip
      Object.entries(files).forEach(([path, { code }]) => {
        // Remove leading slash if present
        const filePath = path.startsWith("/") ? path.substring(1) : path;
        zip.file(filePath, code);
      });

      // Generate the zip file
      const content = await zip.generateAsync({ type: "blob" });

      // Create a download link and trigger download
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "devdistruct-project.zip";
      document.body.appendChild(link);
      link.click();

      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error: any) {
      throw new Error(error);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      size="sm"
      className="absolute top-4 right-4 z-10"
    >
      <Download className="h-4 w-4 mr-2" />
      Download Project
    </Button>
  );
};

export const ChatPage = () => {
  // const { isAuthenticated } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState({});
  const [inputText, setInputText] = useState("");

  const { isFilesLoading, setIsFilesLoading } = useContext(FilesContext);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const { isEditorOpen } = useEditorStore();
  const { chat_id } = useParams();
  const isSmallScreen = useMediaQuery({ maxWidth: 1024 });
  const { message, setMessage } = useContext(MessageContext);

  const firstCodeGen = async () => {
    setIsLoading(true);
    try {
      // Create a prompt that includes information about available resources
      const promptText = message?.prompt || "Create a React application";

      const firstPrompt = `${promptText} ${Prompt.CODE_GEN_PROMPT}`;

      // Create the request payload
      const payload: any = {
        chat_id,
        prompt: firstPrompt,
        image: message?.imageUrl
      };

      // Add files to the request if they exist
      if (message?.figma_file) {
        payload.figma = message.figma_file;
      }

      const response = await sendCodeMessage(payload);

      const Newmessage: Message = {
        ...message,
        prompt: promptText,
        firstResponse: response.data.response
      };

      setMessage(Newmessage);
      console.log("Response from AI:", response.data.response);
      setFiles(JSON.parse(response.data.response));
    } catch (error: any) {
      firstCodeGen();
      console.error("Failed to generate AI code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExistingChat = async () => {
    setIsLoading(true);
    try {
      const response = await getChat(chat_id!);
      console.log("Fetched existing chat:", response.data);

      // Check if there are messages in the chat
      if (response.data.messages && response.data.messages.length > 0) {
        // Look for the most recent code response
        const codeMessages = response.data.messages.filter(
          (msg: any) =>
            msg.type === "code" ||
            (msg.content.includes("{") && msg.content.includes("}"))
        );

        if (codeMessages.length > 0) {
          // Get the most recent code message
          const latestCodeMessage = codeMessages[codeMessages.length - 1];

          try {
            // Try to parse the code content
            const codeContent =
              latestCodeMessage.content || latestCodeMessage.response;
            setFiles(JSON.parse(codeContent));

            // Update the message context
            const fetchedMessage: Message = {
              ...message,
              prompt: response.data.prompt || "",
              firstResponse: codeContent
            };
            setMessage(fetchedMessage);
            console.log("Loaded code from message:", codeContent);
          } catch (parseError) {
            console.error("Error parsing code content:", parseError);
            toast.error("Error parsing code data");
            fallbackToFirstResponse(response.data);
          }
        } else {
          // No code messages found, fall back to firstResponse
          fallbackToFirstResponse(response.data);
        }
      } else {
        // No messages, fall back to firstResponse
        fallbackToFirstResponse(response.data);
      }
    } catch (error: any) {
      console.error("Failed to fetch existing chat:", error);
      toast.error("Failed to load chat data. Generating new content.");
      firstCodeGen();
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to use the firstResponse as a fallback
  const fallbackToFirstResponse = (chatData: any) => {
    if (chatData.firstResponse || chatData.editor_message) {
      try {
        // Try firstResponse first, then editor_message
        const codeContent = chatData.firstResponse || chatData.editor_message;
        setFiles(JSON.parse(codeContent));

        // Update the message context
        const fetchedMessage: Message = {
          ...message,
          prompt: chatData.prompt || "",
          firstResponse: codeContent
        };
        setMessage(fetchedMessage);
        console.log("Loaded code from firstResponse/editor_message");
      } catch (parseError) {
        console.error(
          "Error parsing firstResponse/editor_message:",
          parseError
        );
        toast.error("Could not load saved code. Generating new content.");
        firstCodeGen();
      }
    } else {
      // No valid code found anywhere, generate new code
      console.log("No code content found in chat data, generating new code");
      firstCodeGen();
    }
  };

  useEffect(() => {
    // Check if the current chat_id exists in the chats array in localStorage
    const storedChats = localStorage.getItem("chats");
    const chatsArray = storedChats ? JSON.parse(storedChats) : [];

    if (chat_id) {
      if (chatsArray.includes(chat_id)) {
        // Chat exists, fetch its data
        fetchExistingChat();
      } else {
        // New chat, add to localStorage and generate code
        chatsArray.push(chat_id);
        localStorage.setItem("chats", JSON.stringify(chatsArray));
        firstCodeGen();
      }
    }

    setIsFilesLoading(false);
  }, [chat_id]);

  const generateAiCode = async () => {
    setIsEditLoading(true);

    const PROMPT =
      inputText +
      "\n" +
      JSON.stringify(files, null, 2) +
      "\n" +
      "PLEASE WRITE FULL CODE, WHAT I SENT AND FOLLOW THE INSTRUCTIONS AND USE THE SAME PATTERN AND STYLE IN WHICH CODE IS";
    try {
      const response = await sendCodeMessage({
        chat_id,
        prompt: PROMPT,
        image: message?.imageUrl
      });

      const Newmessage: Message = {
        ...message,
        prompt: message?.prompt || "",
        firstResponse: response.data.response
      };
      setMessage(Newmessage);

      setFiles(JSON.parse(response.data.response));
    } catch (err: any) {
      console.error("Failed to update code:", err);
      generateAiCode();
    } finally {
      setIsFilesLoading(false);
      setIsEditLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center flex-col">
        <motion.div
          className="relative w-48 h-48 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Brain/Circuit SVG */}
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Brain shape */}
            <motion.path
              d="M100 20C50 20 20 50 20 100C20 150 50 180 100 180C150 180 180 150 180 100C180 50 150 20 100 20Z"
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
            />

            {/* Neural network connections */}
            <motion.path
              d="M40 70H160M50 100H150M40 130H160M70 40V160M100 30V170M130 40V160"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Circuit nodes */}
            <motion.path
              d="M60 60L140 140M60 140L140 60M50 100C70 80 130 120 150 100"
              stroke="#8b5cf6"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            />

            {/* Neural pulses */}
            {[40, 60, 80, 100, 120, 140, 160].map((pos, i) => (
              <motion.circle
                key={i}
                cx="100"
                cy={pos}
                r="3"
                fill="#f43f5e"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Horizontal pulses */}
            {[40, 70, 100, 130, 160].map((pos, i) => (
              <motion.circle
                key={`h-${i}`}
                cx={pos}
                cy="100"
                r="3"
                fill="#3b82f6"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15 + 0.5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </svg>

          {/* Orbital rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-indigo-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-teal-500/30"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>

        <motion.h2
          className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-teal-500 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.span
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Neural Processing...
          </motion.span>
        </motion.h2>

        <motion.p
          className="text-xl text-center text-white/80"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.span
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Dev Distruct is Making it ...
          </motion.span>
        </motion.p>
      </div>
    );

  if (!files || Object.keys(files).length === 0) return null; // or a loader

  return (
    <SandpackProvider
      theme="dark"
      template="react"
      files={files}
      options={{
        autorun: true,
        autoReload: true,
        externalResources: ["https://cdn.tailwindcss.com"]
      }}
    >
      <div className="flex h-svh w-full bg-dim-black relative">
        {isSmallScreen ? (
          // Mobile & Tablet View: Full width editor with chat in sheet
          <div className="w-full h-full">
            <CodeEditor isEditLoading={isEditLoading} />
            <DownloadButton />
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="fixed top-10 right-4 z-50"
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85%] sm:w-[400px] p-0 z-[100]"
              >
                <ChatInterface
                  isMobile={true}
                  onInputChange={(text) => {
                    setInputText(text);
                  }}
                  onEnter={() => {
                    generateAiCode();
                    // You can call any function here (e.g., trigger AI code, log analytics, etc.)
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          // Desktop View: Side by side layout
          <div className="w-full h-full">
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={20} className="relative">
                <ChatInterface
                  isMobile={false}
                  onInputChange={(text) => {
                    setInputText(text);
                  }}
                  onEnter={() => {
                    generateAiCode();
                    // You can call any function here (e.g., trigger AI code, log analytics, etc.)
                  }}
                />
              </ResizablePanel>
              {isFilesLoading ? (
                <>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={80} className="relative">
                    <AnimatePresence>
                      <motion.div
                        key="editor"
                        className="flex gap-2 flex-1 items-center justify-center h-screen w-full"
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 300 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span>Sit Tight while we do the magic</span>{" "}
                        <Loader2 className="animate-spin" />
                      </motion.div>
                    </AnimatePresence>
                  </ResizablePanel>
                </>
              ) : (
                isEditorOpen && (
                  <>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={50} className="relative">
                      <AnimatePresence>
                        <motion.div
                          key="editor"
                          className="flex-1 h-full"
                          initial={{ opacity: 0, x: 300 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 300 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CodeEditor isEditLoading={isEditLoading} />
                          <DownloadButton />
                        </motion.div>
                      </AnimatePresence>
                    </ResizablePanel>
                  </>
                )
              )}
            </ResizablePanelGroup>
          </div>
        )}
      </div>
    </SandpackProvider>
  );
};
