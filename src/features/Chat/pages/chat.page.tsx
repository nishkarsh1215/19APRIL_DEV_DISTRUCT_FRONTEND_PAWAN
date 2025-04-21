import { useEditorStore } from "@/store/editor.store";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { CodeEditor, ChatInterface } from "../components";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from "@/components/ui/resizable";
import { SandpackProvider } from "@codesandbox/sandpack-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sendCodeMessage } from "@/features/Authentication/services";
import { Message, MessageContext } from "@/store/message.store";
import Prompt from "@/constants/Prompt";
import { FilesContext } from "@/store/file.store";

export const ChatPage = () => {
  // const { isAuthenticated } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState({});
  const [inputText, setInputText] = useState("");

  const { isFilesLoading, setIsFilesLoading } = useContext(FilesContext);
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
    } catch (err) {
      console.error("Failed to generate AI code", err);
    } finally {
      setIsFilesLoading(false);
    }
  };

  if (isLoading)
    return (
      <h2 className="text-center font-bold flex items-center justify-center h-screen gap-4 text-3xl">
        <span>Please Wait</span> <Loader2 className="animate-spin h-8 w-8" />
      </h2>
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
            <CodeEditor />
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
                          <CodeEditor />
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
