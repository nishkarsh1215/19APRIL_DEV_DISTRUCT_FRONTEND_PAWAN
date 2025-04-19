import { createContext } from "react";

export interface EditorMessage {
  message_id: string;
  prompt: string;
  response: string;
  created_at: string;
}

export const EditorMessageContext = createContext<{
  editorMessage: EditorMessage | null;
  setEditorMessage: (msg: EditorMessage | null) => void;
}>({
  editorMessage: null,
  setEditorMessage: () => {}
});
