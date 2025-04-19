import { useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  useActiveCode,
  SandpackStack,
  FileTabs,
  useSandpack
} from "@codesandbox/sandpack-react";
import { CodeFile } from "@/data/DummyData";

export function MonacoEditor({
  activeFile,
  onFileChange
}: {
  activeFile: CodeFile | null;
  onFileChange: (fileId: string, name: string, code: string) => void;
}) {
  const { updateCode } = useActiveCode();
  const { sandpack } = useSandpack();

  // NEW: Effect to trigger onFileChange when component mounts or activeFile changes
  useEffect(() => {
    if (activeFile) {
      onFileChange(activeFile.id, activeFile.name, activeFile.code);
    }
  }, [activeFile, onFileChange]); // Only depend on activeFile to avoid unnecessary triggers

  return (
    <SandpackStack style={{ height: "100vh", margin: 0 }}>
      <FileTabs />
      <div style={{ flex: 1, paddingTop: 8, background: "#1e1e1e" }}>
        <Editor
          width="100%"
          height="100%"
          language="javascript"
          theme="vs-dark"
          key={sandpack.activeFile}
          defaultValue={activeFile?.code}
          onChange={(value) => {
            updateCode(value || "");
            onFileChange(
              activeFile?.id as string,
              activeFile?.name as string,
              value!
            );
          }}
        />
      </div>
    </SandpackStack>
  );
}
