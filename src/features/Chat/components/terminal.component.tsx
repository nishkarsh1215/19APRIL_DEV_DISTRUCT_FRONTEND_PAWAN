import { Dispatch, FC, SetStateAction, useCallback } from "react";
import { ReactTerminal } from "react-terminal";
import { CodeFile } from "@/data/DummyData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSandpack } from "@codesandbox/sandpack-react";
import { useParams } from "react-router-dom";
import { updateEditorMessage } from "@/features/Authentication/services";

interface TerminalProps {
  setFiles: Dispatch<SetStateAction<Record<string, CodeFile>>>;
  onPackageJsonUpdate?: (updatedContent: string) => void;
}

export const Terminal: FC<TerminalProps> = ({ setFiles }) => {
  const { sandpack } = useSandpack();
  const { chat_id } = useParams();

  const updatePackageJson = async (newDependencies: Record<string, string>) => {
    try {
      // 1. Get current package.json content
      const currentPkgContent = sandpack.files["/package.json"]?.code || "{}";
      const pkgJson = JSON.parse(currentPkgContent);

      // 2. Add new dependencies
      pkgJson.dependencies = {
        ...pkgJson.dependencies,
        ...newDependencies
      };

      // 3. Update both Sandpack and local state
      const updatedContent = JSON.stringify(pkgJson, null, 2);
      Object.keys(sandpack.files).forEach((fileName) => {
        if (fileName === "/package.json") {
          sandpack.updateFile(fileName, updatedContent);
        }
      });

      // 4. Force Sandpack to reload with new dependencies
      await sandpack.runSandpack();

      // 5. Update DB
      if (chat_id) {
        await updateEditorMessage(chat_id, JSON.stringify(sandpack.files));
      }

      // 6. Update local files state
      setFiles((prev) => ({
        ...prev,
        "/package.json": {
          ...prev["/package.json"],
          code: updatedContent
        }
      }));
    } catch (err) {
      console.error("Failed to update package.json:", err);
    }
  };

  const fetchLatestVersion = useCallback(
    async (dep: string): Promise<string | null> => {
      try {
        const response = await fetch(
          `https://registry.npmjs.org/${dep}/latest`
        );
        if (!response.ok) {
          return null;
        }
        const data = await response.json();
        return data.version;
      } catch {
        return null;
      }
    },
    []
  );

  const commands = {
    npm: async (args: string) => {
      const [subCommand, ...packages] = args.split(" ");

      if (
        (subCommand === "install" ||
          subCommand === "i" ||
          subCommand === "add") &&
        packages.length > 0
      ) {
        const addedDeps: Record<string, string> = {};
        const notFoundDeps: string[] = [];

        for (const pkg of packages) {
          const version = await fetchLatestVersion(pkg);
          if (version) {
            addedDeps[pkg] = `^${version}`;
          } else {
            notFoundDeps.push(pkg);
          }
        }

        if (Object.keys(addedDeps).length > 0) {
          updatePackageJson(addedDeps);
        }

        let output = "";
        if (Object.keys(addedDeps).length > 0) {
          output += "Added dependencies:\n";
          for (const [dep, ver] of Object.entries(addedDeps)) {
            output += `  ${dep}@${ver}\n`;
          }
        }

        if (notFoundDeps.length > 0) {
          output += `Failed to add dependencies: ${notFoundDeps.join(", ")}\n`;
        }

        return output.trim();
      } else {
        return "Invalid command. Use 'npm install <package1> <package2> ...' to install packages.";
      }
    },
    yarn: async (args: string) => {
      const [subCommand, ...packages] = args.split(" ");

      if (
        (subCommand === "install" ||
          subCommand === "i" ||
          subCommand === "add") &&
        packages.length > 0
      ) {
        const addedDeps: Record<string, string> = {};
        const notFoundDeps: string[] = [];

        for (const pkg of packages) {
          const version = await fetchLatestVersion(pkg);
          if (version) {
            addedDeps[pkg] = `^${version}`;
          } else {
            notFoundDeps.push(pkg);
          }
        }

        if (Object.keys(addedDeps).length > 0) {
          updatePackageJson(addedDeps);
        }

        let output = "";
        if (Object.keys(addedDeps).length > 0) {
          output += "Added dependencies:\n";
          for (const [dep, ver] of Object.entries(addedDeps)) {
            output += `  ${dep}@${ver}\n`;
          }
        }

        if (notFoundDeps.length > 0) {
          output += `Failed to add dependencies: ${notFoundDeps.join(", ")}\n`;
        }

        return output.trim();
      } else {
        return "Invalid command. Use 'yarn add <package1> <package2> ...' to install packages.";
      }
    },
    pnpm: async (args: string) => {
      const [subCommand, ...packages] = args.split(" ");

      if (
        (subCommand === "install" ||
          subCommand === "i" ||
          subCommand === "add") &&
        packages.length > 0
      ) {
        const addedDeps: Record<string, string> = {};
        const notFoundDeps: string[] = [];

        for (const pkg of packages) {
          const version = await fetchLatestVersion(pkg);
          if (version) {
            addedDeps[pkg] = `^${version}`;
          } else {
            notFoundDeps.push(pkg);
          }
        }

        if (Object.keys(addedDeps).length > 0) {
          updatePackageJson(addedDeps);
        }

        let output = "";
        if (Object.keys(addedDeps).length > 0) {
          output += "Added dependencies:\n";
          for (const [dep, ver] of Object.entries(addedDeps)) {
            output += `  ${dep}@${ver}\n`;
          }
        }

        if (notFoundDeps.length > 0) {
          output += `Failed to add dependencies: ${notFoundDeps.join(", ")}\n`;
        }

        return output.trim();
      } else {
        return "Invalid command. Use 'pnpm install <package1> <package2> ...' to install packages.";
      }
    },
    help: () =>
      "Available commands:\n" +
      "  npm install <package1> <package2> ... - Install specified packages\n" +
      "  help - Show this help message"
  };

  return (
    <ScrollArea className="scale-90">
      <ReactTerminal
        commands={commands}
        showControlBar={false}
        themes={{
          "my-custom-theme": {
            themeBGColor: "#0F0F10",
            themeColor: "#FFFEFC",
            themePromptColor: "#a917a8"
          }
        }}
        theme="my-custom-theme"
        welcomeMessage={
          <p className="mb-1">Use npm/yarn commands to add dependencies.</p>
        }
        prompt=">>"
      />
    </ScrollArea>
  );
};
