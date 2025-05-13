import { useState, useEffect, useMemo, useCallback, FC } from "react";

import { Sandpack } from "@codesandbox/sandpack-react";
import { FolderClosed } from "lucide-react";

import { initialFiles } from "@/constants";
import { CodeFile } from "@/data/DummyData";
import { Button } from "@/components/ui/button";
import { FileTree, Terminal } from ".";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useParams } from "react-router-dom";
import { getFiles } from "@/features/Authentication/services/axios.service"; // NEW: import getFiles API

// Helper function to determine language based on file extension
const determineLanguage = (filename: string): string => {
  const ext = filename.split(".").pop();
  switch (ext) {
    case "js":
      return "javascript";
    case "jsx":
      return "jsx";
    case "ts":
      return "typescript";
    case "tsx":
      return "tsx";
    case "html":
      return "html";
    case "json":
      return "json";
    default:
      return "javascript";
  }
};

// Helper function to transform CodeFile to Sandpack-compatible format
const transformFilesForSandpack = (files: Record<string, CodeFile>) => {
  const transformed: Record<string, { code: string }> = {};
  Object.entries(files).forEach(([path, file]) => {
    transformed[path] = { code: file.code };
  });
  return transformed;
};

export const CodeEditor: FC = () => {
  // Reintroduce editorHeight state for dynamic sizing
  const [editorHeight, setEditorHeight] = useState("80vh");
  const { chat_id } = useParams();

  useEffect(() => {
    const updateHeight = () => {
      setEditorHeight(window.innerWidth <= 768 ? "50vh" : "75vh");
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);

  const transformedFiles: Record<string, CodeFile> = useMemo(
    () =>
      Object.entries(initialFiles).reduce((acc, [path, code]) => {
        const name = path.split("/").pop() || path;
        acc[path] = {
          id: path,
          name,
          language: determineLanguage(name),
          code
        };
        return acc;
      }, {} as Record<string, CodeFile>),
    []
  );

  const [files, setFiles] =
    useState<Record<string, CodeFile>>(transformedFiles);

  // NEW: Fetch files from the API when chat_id changes
  useEffect(() => {
    async function fetchFiles() {
      if (chat_id) {
        try {
          // Assuming your API returns an array of file objects
          const response = await getFiles({ chat_id });
          const apiFiles: CodeFile[] = response.data;
          // Convert array to record keyed by file id
          const filesRecord = apiFiles.reduce((acc, file) => {
            acc[file.id] = file;
            return acc;
          }, {} as Record<string, CodeFile>);
          setFiles(filesRecord);
        } catch (error) {
          console.error("Failed to fetch files", error);
        }
      }
    }
    fetchFiles();
  }, [chat_id]);

  // Transform files for Sandpack and memoize the result
  const sandpackFiles = useMemo(
    () => transformFilesForSandpack(files),
    [files]
  );

  const visibleFiles = useMemo(() => Object.keys(files), [files]);

  // Remove editorHeight from sandpackOptions for dynamic sizing.
  const sandpackOptions = useMemo(
    () => ({
      showLineNumbers: true,
      visibleFiles: visibleFiles,
      resizablePanels: true,
      showTabs: true,
      layout: "preview" as const
    }),
    [visibleFiles]
  );

  const handleSelectFile = useCallback((file: CodeFile) => {
    setSelectedFile(file);
  }, []);

  const handleDelete = useCallback(
    (deletedItemId: string) => {
      if (selectedFile?.id === deletedItemId) {
        setSelectedFile(null);
      }
      setFiles((prevFiles) => {
        const updatedFiles = { ...prevFiles };
        delete updatedFiles[deletedItemId];
        return updatedFiles;
      });
    },
    [selectedFile?.id, setFiles]
  );

  const handleCreateFile = useCallback(
    (newFile: CodeFile) => {
      setFiles((prevFiles) => ({
        ...prevFiles,
        [newFile.id]: newFile
      }));
      setSelectedFile(newFile);
    },
    [setFiles]
  );

  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="block sm:hidden">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild className="absolute bottom-5 left-5 z-[100]">
            <Button size="icon" variant="outline">
              <FolderClosed />
            </Button>
          </SheetTrigger>
          <SheetContent className="text-white">
            <div className="h-full overflow-auto mt-4">
              <FileTree
                data={files}
                onSelectFile={handleSelectFile}
                onCreateFile={handleCreateFile}
                onDelete={handleDelete}
                selectedFileId={selectedFile?.id || null}
                chatId={chat_id}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <ResizablePanelGroup direction="horizontal">
        {/* Hide FileTree on mobile */}
        <ResizablePanel
          defaultSize={25}
          minSize={15}
          className="hidden sm:block"
        >
          <div className="h-full overflow-auto border-l border-gray-700">
            {/* ...existing FileTree usage... */}
            <FileTree
              data={files}
              onSelectFile={handleSelectFile}
              onCreateFile={handleCreateFile}
              onDelete={handleDelete}
              selectedFileId={selectedFile?.id || null}
              chatId={chat_id}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          {/* Add full height class for dynamic vertical resizing */}
          <ResizablePanelGroup direction="vertical" className="h-full">
            <ResizablePanel defaultSize={70} className="overflow-hidden">
              <div className="overflow-auto">
                <Sandpack
                  key={selectedFile?.id}
                  template="react"
                  files={sandpackFiles}
                  options={{
                    ...sandpackOptions,
                    closableTabs: true,
                    editorHeight: editorHeight,
                    codeEditor: { extensions: [] },
                    classes: {
                      "sp-editor": "md:border-r-2 border-purple-500"
                    },
                    wrapContent: true,
                    activeFile: selectedFile ? selectedFile.id : "/App.js",
                    layout: "preview"
                  }}
                  theme="dark"
                />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={30} className="overflow-scroll">
              <div className="h-full overflow-auto">
                <Terminal setFiles={setFiles} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
