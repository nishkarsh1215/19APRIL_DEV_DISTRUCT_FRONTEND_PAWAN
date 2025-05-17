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

  // Helper function to clean prompts of system instructions
  const cleanPrompt = (prompt: string | undefined): string => {
    if (!prompt) return "";
    return prompt.replace(Prompt.CHAT_PROMPT, "").trim();
  };

  const fetchExistingChat = async () => {
    setIsLoading(true);
    try {
      const response = await getChat(chat_id!);
      console.log(
        "Fetched existing chat:",
        response.data.code_messages[response.data.code_messages.length - 1]
      );

      // If there are messages, check for the most recent code response
      if (
        response.data.code_messages &&
        response.data.code_messages.length > 0
      ) {
        const codeContent =
          response.data.code_messages[response.data.code_messages.length - 1]
            .response;
        setFiles(JSON.parse(codeContent));

        // Update the message context with chat title and clean prompt
        const fetchedMessage: Message = {
          ...message,
          prompt: cleanPrompt(response.data.prompt || ""), // Clean the prompt for UI display
          firstResponse: codeContent
        };
        setMessage(fetchedMessage);
        console.log("Loaded code from latest message");
      }
    } catch (error: any) {
      console.error("Failed to fetch existing chat:", error);
      toast.error("Failed to load chat data. Generating new content.");
      firstCodeGen();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!chat_id) return;

    setIsLoading(true);

    // Check if the current chat_id exists in the chats array in localStorage
    const storedChats = localStorage.getItem("chats");
    const chatsArray = storedChats ? JSON.parse(storedChats) : [];

    if (chatsArray.includes(chat_id)) {
      // Chat exists, fetch its data
      fetchExistingChat();
    } else {
      // New chat, add to localStorage and generate code
      chatsArray.push(chat_id);
      localStorage.setItem("chats", JSON.stringify(chatsArray));
      firstCodeGen();
    }

    setIsFilesLoading(false);
  }, [chat_id]); // Only depend on chat_id to prevent unnecessary rerenders

  const generateAiCode = async () => {
    if (!inputText || inputText.trim() === "") {
      toast.error("Please enter a prompt before generating code");
      return;
    }

    setIsEditLoading(true);
    toast.info("Generating code...");

    try {
      // Format the prompt to be more explicit about what we want
      const PROMPT = `
${inputText}

Here's the current code structure:
${JSON.stringify(files, null, 2)}

INSTRUCTIONS:
- Please update the code based on my request
- Return the complete codebase as a valid JSON object WITHOUT any markdown formatting
- DO NOT use markdown code blocks (no \`\`\`json)
- Return ONLY the raw JSON object
- Maintain the same file structure
- Ensure the code is valid and follows the existing patterns
- Make sure special characters like quotes are properly escaped
`;

      console.log("Sending prompt:", PROMPT);
      console.log("Using chat_id:", chat_id);

      const response = await sendCodeMessage({
        chat_id,
        prompt: PROMPT,
        image: message?.imageUrl
      });

      console.log("Response received:", response.data);

      // First update the message context
      const Newmessage: Message = {
        ...message,
        prompt: message?.prompt || "",
        firstResponse: response.data.response
      };
      setMessage(Newmessage);

      // Extract and fix JSON function with more robust handling
      const extractAndFixJSON = (text: string) => {
        // Function to find all matched JSON objects and return the largest valid one
        const findValidJSON = (input: string) => {
          // First try: Find content between code blocks
          const codeBlockPattern =
            /```(?:json|javascript|typescript|jsx|tsx)?\n?([\s\S]*?)```/g;
          let match;
          const potentialJSONs = [];

          while ((match = codeBlockPattern.exec(input)) !== null) {
            potentialJSONs.push(match[1].trim());
          }

          // Second try: Find all content between curly braces (assuming it's a JSON object)
          const startIndexes = [];
          const endIndexes = [];
          let depth = 0;

          for (let i = 0; i < input.length; i++) {
            if (input[i] === "{") {
              if (depth === 0) {
                startIndexes.push(i);
              }
              depth++;
            } else if (input[i] === "}") {
              depth--;
              if (depth === 0) {
                endIndexes.push(i);
              }
            }
          }

          // Collect all potential JSON objects from the braces matching
          for (let i = 0; i < startIndexes.length; i++) {
            if (i < endIndexes.length) {
              potentialJSONs.push(
                input.substring(startIndexes[i], endIndexes[i] + 1)
              );
            }
          }

          // Sort by length (descending) to try the largest potential JSON first
          potentialJSONs.sort((a, b) => b.length - a.length);

          // Try to parse each potential JSON
          for (const jsonStr of potentialJSONs) {
            try {
              return JSON.parse(jsonStr);
            } catch (e) {
              console.log(e);
              // Try to fix common issues
              try {
                // Fix for unescaped quotes in JSON strings
                const fixedJSON = jsonStr
                  .replace(/([^\\])\\n/g, "$1\\\\n") // Fix escaped newlines
                  .replace(/([^\\])\\r/g, "$1\\\\r") // Fix escaped returns
                  .replace(/([^\\])\\t/g, "$1\\\\t") // Fix escaped tabs
                  .replace(/\t/g, "\\t") // Replace tabs with escaped tabs
                  .replace(/\r/g, "\\r") // Replace returns with escaped returns
                  .replace(/\n(?=[^"]*"[^"]*(?:"[^"]*"[^"]*)*$)/g, "\\n") // Replace newlines inside JSON strings
                  .replace(/([a-zA-Z0-9])"/g, '$1\\"') // Fix unescaped quotes
                  .replace(/"{/g, '\\"{') // Fix quotes before objects
                  .replace(/}"/g, '}\\"'); // Fix quotes after objects

                return JSON.parse(fixedJSON);
              } catch (fixError) {
                console.log("Failed to fix JSON:", fixError);
                // Continue to the next potential JSON
              }
            }
          }

          return null; // No valid JSON found
        };

        // Try to find and parse a valid JSON
        const result = findValidJSON(text);
        if (result) {
          return result;
        }

        // As a last resort, try to manually process the text
        try {
          // Find the start and end of what looks like a JSON object
          const firstBrace = text.indexOf("{");
          const lastBrace = text.lastIndexOf("}");

          if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
            // Ensure we're not cutting off in the middle of a string
            // Count quotes to make sure they're balanced
            const substring = text.substring(firstBrace, lastBrace + 1);
            let quoteCount = 0;

            for (let i = 0; i < substring.length; i++) {
              if (
                substring[i] === '"' &&
                (i === 0 || substring[i - 1] !== "\\")
              ) {
                quoteCount++;
              }
            }

            // If quotes are balanced (even count), proceed
            if (quoteCount % 2 === 0) {
              try {
                return JSON.parse(substring);
              } catch (e) {
                console.error("Final parsing attempt failed:", e);
              }
            } else {
              console.error("Unbalanced quotes in JSON extraction");
            }
          }
        } catch (e) {
          console.error("Manual JSON extraction failed:", e);
        }

        return null;
      };

      // Try to extract and parse the JSON
      const extractedJSON = extractAndFixJSON(response.data.response);

      if (extractedJSON) {
        console.log("Successfully extracted and parsed JSON");
        setFiles(extractedJSON);
        toast.success("Code updated successfully");
      } else {
        // If all extraction methods fail, keep existing files
        console.error("All JSON extraction methods failed");
        toast.error(
          "Couldn't parse AI response as valid code. Keeping existing code."
        );
      }
    } catch (err: any) {
      console.error("Failed to update code:", err);
      toast.error("Error communicating with the AI service. Please try again.");
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
        bundlerURL: "http://147.93.111.242:3000",
        autorun: true,
        autoReload: true,
        recompileMode: "immediate",
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
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          // Desktop View: Side by side layout with proper sidebar
          <div className="w-full h-full flex">
            {/* Main content area */}
            <div className="flex-1">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={30} className="relative">
                  <ChatInterface
                    isMobile={false}
                    onInputChange={(text) => {
                      setInputText(text);
                    }}
                    onEnter={() => {
                      generateAiCode();
                    }}
                  />
                </ResizablePanel>
                {isFilesLoading ? (
                  <>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={70} className="relative">
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
                      <ResizablePanel defaultSize={70} className="relative">
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
          </div>
        )}
      </div>
    </SandpackProvider>
  );
};
