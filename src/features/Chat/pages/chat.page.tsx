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
import { sendCodeMessage } from "@/features/Authentication/services";
import { Message, MessageContext } from "@/store/message.store";
import Prompt from "@/constants/Prompt";
import { FilesContext } from "@/store/file.store";

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
    } catch (error) {
      console.error("Failed to download project files:", error);
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
    console.log("first code gen");
    const firstPrompt = Prompt.CODE_GEN_PROMPT;
    console.log("first prompt");
    console.log(firstPrompt);
    try {
      const response = await sendCodeMessage({
        chat_id,
        prompt: firstPrompt
      });
      const tempImageUrl = message?.imageUrl;
      console.log("heyyyyyyyyyyyyyyy");
      console.log(response.data.response);

      const Newmessage: Message = {
        prompt: message?.prompt ?? "",
        imageUrl: tempImageUrl || undefined,
        firstResponse: response.data.response
      };
      setMessage(Newmessage);
      setFiles(JSON.parse(response.data.response));
      // setEditorMessage(newEditorMessage)
    } catch (err) {
      console.error("Failed to generate AI code", err);
      firstCodeGen();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    firstCodeGen();
    setIsFilesLoading(false);
  }, []);

  const generateAiCode = async () => {
    console.log("generate ai code");
    setIsEditLoading(true);

    const PROMPT =
      "PLEASE RETURN THE FULL CODE, DO THE NECESSARY CHANGES AFTER READING THE INPUT BUT PLEASE RETURN THE FULL CODE... EVERYTHING SHOULD BE RETURNED...\n" +
      "THIS IS INPUT AND INSTRUCTIONS --> " +
      inputText +
      "\n" +
      "THIS IS THE CODE --> " +
      JSON.stringify(files, null, 2) +
      "\n" +
      "PLEASE WRITE FULL CODE, WHAT I SENT AND FOLLOW THE INSTRUCTIONS AND USE THE SAME PATTERN AND STYLE IN WHICH CODE IS";
    console.log("EXTRA PROMPT");
    console.log(PROMPT);
    try {
      const response = await sendCodeMessage({
        chat_id,
        prompt: PROMPT
      });
      const tempImageUrl = message?.imageUrl;
      console.log("heyyyyyyyyyyyyyyy");
      console.log(response.data.response);

      const Newmessage: Message = {
        prompt: message?.prompt ?? "",
        imageUrl: tempImageUrl || undefined,
        firstResponse: response.data.response
      };
      setMessage(Newmessage);

      // NEW: Immediately store the entire returned "files" data into editorMessage for Editor usage
      // const newEditorMessage = {
      //   message_id: uuidv4(),
      //   prompt: PROMPT,
      //   response: response.data.response, // a JSON string containing { files: { ... } }
      //   created_at: new Date().toISOString(),
      // }
      setFiles(JSON.parse(response.data.response));
      // setEditorMessage(newEditorMessage)
      setIsEditLoading(false);
    } catch (err) {
      console.error("Failed to generate AI code", err);
      setIsEditLoading(false);
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
