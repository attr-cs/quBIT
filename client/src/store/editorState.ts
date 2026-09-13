    import { create } from "zustand";

    export interface OpenFileTab {
    id: string;
    name: string;
    }

    interface EditorState {
    tabs: OpenFileTab[];
    activeFileId: string | null;
    openFile: (file: { id: string; name: string }) => void;
    setActive: (id: string) => void;
    closeTab: (id: string) => void;
    }

    export const useEditorStore = create<EditorState>((set) => ({
    tabs: [],
    activeFileId: null,
    openFile: (file) =>
        set((state) => ({
        tabs: state.tabs.some((t) => t.id === file.id) ? state.tabs : [...state.tabs, file],
        activeFileId: file.id,
        })),
    setActive: (id) => set({ activeFileId: id }),
    closeTab: (id) =>
        set((state) => {
        const idx = state.tabs.findIndex((t) => t.id === id);
        const tabs = state.tabs.filter((t) => t.id !== id);
        let activeFileId = state.activeFileId;
        if (state.activeFileId === id) {
            const next = tabs[idx] ?? tabs[idx - 1] ?? null;
            activeFileId = next ? next.id : null;
        }
        return { tabs, activeFileId };
        }),
    }));
