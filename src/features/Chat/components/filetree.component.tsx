import React, { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  File as FileIcon,
  FolderClosed,
  FolderOpen,
  Plus,
  Trash
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { CodeFile } from "@/data/DummyData";
import {
  createFile,
  deleteFile
} from "@/features/Authentication/services/axios.service";

interface FileTreeProps {
  data: Record<string, CodeFile>;
  onSelectFile: (file: CodeFile) => void;
  onCreateFile: (file: CodeFile) => void;
  onDelete: (itemId: string) => void;
  selectedFileId: string | null;
  chatId?: string;
}

export const FileTree: React.FC<FileTreeProps> = ({
  data,
  onSelectFile,
  onCreateFile,
  onDelete,
  selectedFileId,
  chatId
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [isCreating, setIsCreating] = useState<{
    path: string;
    type: "file" | "folder";
  } | null>(null);
  const [newItemName, setNewItemName] = useState("");

  const handleDelete = async (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Prevent deleting public folder
    if (path === "/public") {
      toast({
        title: "Deletion not allowed",
        description: "Cannot delete public folder."
      });
      return;
    }
    // Prevent deleting src folder
    if (path === "/src") {
      toast({
        title: "Deletion not allowed",
        description: "Cannot delete src/ folder."
      });
      return;
    }
    // NEW: Prevent deleting package.json file
    if (path === "/package.json") {
      toast({
        title: "Deletion not allowed",
        description: "Cannot delete package.json file."
      });
      return;
    }
    try {
      await deleteFile(path);
      onDelete(path);
      toast({
        title: `Deleted ${path}`,
        description: `${path} has been deleted successfully.`
      });
    } catch (error) {
      console.error("Failed to delete file", error);
      toast({
        title: "Deletion Failed",
        description: `Failed to delete ${path}.`
      });
    }
  };

  const startCreating = (parentPath: string, type: "file" | "folder") => {
    setIsCreating({ path: parentPath, type });
    setNewItemName("");
    setExpanded((prev) => ({ ...prev, [parentPath]: true }));
  };

  const handleCreate = async (parentPath: string) => {
    if (!newItemName.trim() || !isCreating) return;
    // NEW: Prevent creating files in public folder
    if (parentPath === "/public") {
      toast({
        title: "Creation not allowed",
        description: "Create files under src/ folder."
      });
      return;
    }
    const newPath = `${parentPath}/${newItemName}`;
    const newFile: CodeFile = {
      id: newPath,
      name: newItemName,
      language: isCreating.type === "file" ? "javascript" : "",
      code: isCreating.type === "file" ? "" : ""
    };
    try {
      await createFile({
        name: newFile.name,
        code: newFile.code,
        chat_id: chatId
      });
      onCreateFile(newFile);
      toast({
        title: `Created ${isCreating.type}`,
        description: `${newItemName} has been created successfully.`
      });
    } catch (error) {
      console.error("Failed to create file", error);
      toast({
        title: "Creation Failed",
        description: `Failed to create ${newItemName}.`
      });
    }
    setIsCreating(null);
    setNewItemName("");
  };

  const renderTree = (currentPath: string) => {
    // Get all childs at currentPath
    const children = Object.keys(data)
      .filter(
        (filePath) =>
          filePath.startsWith(currentPath) && filePath !== currentPath
      )
      .map((filePath) => filePath.slice(currentPath.length + 1).split("/")[0]);

    const uniqueChildren = Array.from(new Set(children));

    // Separate folders and files
    const folderChildren: string[] = [];
    const fileChildren: string[] = [];

    uniqueChildren.forEach((child) => {
      const fullPath = `${currentPath}/${child}`;
      const isFile = !Object.keys(data).some((path) =>
        path.startsWith(fullPath + "/")
      );
      if (isFile) {
        fileChildren.push(child);
      } else {
        folderChildren.push(child);
      }
    });

    // Sort alphabetically
    folderChildren.sort((a, b) => a.localeCompare(b));
    fileChildren.sort((a, b) => a.localeCompare(b));
    const sortedChildren = [...folderChildren, ...fileChildren];

    return sortedChildren.map((child) => {
      const fullPath = `${currentPath}/${child}`;
      const isFile = !Object.keys(data).some((path) =>
        path.startsWith(fullPath + "/")
      );

      return (
        <ContextMenu key={fullPath}>
          <ContextMenuTrigger>
            <div className="group">
              <div
                className={`flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 py-1 px-2 ${
                  selectedFileId === fullPath
                    ? "bg-gray-200 dark:bg-gray-700"
                    : ""
                }`}
                onClick={() => {
                  if (isFile) {
                    onSelectFile(data[fullPath]);
                  } else {
                    // Toggle folder expansion
                    setExpanded((prev) => ({
                      ...prev,
                      [fullPath]: !prev[fullPath]
                    }));
                  }
                }}
              >
                <div className="flex items-center">
                  {!isFile && (
                    <>
                      {expanded[fullPath] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                      {expanded[fullPath] ? (
                        <FolderOpen size={16} className="ml-1 text-blue-500" />
                      ) : (
                        <FolderClosed
                          size={16}
                          className="ml-1 text-blue-500"
                        />
                      )}
                    </>
                  )}
                  {isFile && (
                    <FileIcon size={16} className="ml-2 text-gray-500" />
                  )}
                  <span className="ml-1 truncate">{child}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!isFile && (
                    <Plus
                      className="w-4 h-4 hover:text-blue-500 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        startCreating(fullPath, "file");
                      }}
                    />
                  )}
                  <Trash
                    className="w-4 h-4 hover:text-red-500 cursor-pointer"
                    onClick={(e) => handleDelete(fullPath, e)}
                  />
                </div>
              </div>
              {!isFile && expanded[fullPath] && (
                <div className="ml-4">
                  {isCreating?.path === fullPath &&
                    isCreating.type === "file" && (
                      <div className="flex items-center gap-2 py-1 px-2 bg-gray-50 dark:bg-gray-900 rounded my-1">
                        <FileIcon size={16} className="mr-1 text-gray-500" />
                        <Input
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreate(fullPath);
                            if (e.key === "Escape") setIsCreating(null);
                          }}
                          placeholder="New file name..."
                          className="h-6 py-1 px-2"
                          autoFocus
                        />
                      </div>
                    )}
                  {renderTree(fullPath)}
                </div>
              )}
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            {!isFile && (
              <>
                <ContextMenuItem
                  onClick={() => startCreating(fullPath, "file")}
                >
                  <FileIcon className="w-4 h-4 mr-2" />
                  New File
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => startCreating(fullPath, "folder")}
                >
                  <FolderClosed className="w-4 h-4 mr-2" />
                  New Folder
                </ContextMenuItem>
              </>
            )}
            <ContextMenuItem
              className="text-red-600"
              onClick={(e) => handleDelete(fullPath, e)}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      );
    });
  };

  return <div className="text-sm select-none">{renderTree("")}</div>;
};
