import { create } from 'zustand';

interface EditorState {
    isEditorOpen: boolean;
    toggleEditor: () => void;
}

// Check if the user is on a mobile device using a media query
const isMobileDevice = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;

export const useEditorStore = create<EditorState>((set) => ({
    isEditorOpen: !isMobileDevice, // false on mobile, true on other devices
    toggleEditor: () => set((state) => ({ isEditorOpen: !state.isEditorOpen })),
}));
