import { FileText } from "lucide-react";
import { Editor } from "@monaco-editor/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getFileData, updateFile } from "../api/file";
import { useEditorStore } from "../store/editorState";
import { getLanguageFromFileName } from "../utils/getLanguageFromFileName";
import FileIcon from "./FileIcon";

const FileEditor: React.FC = () => {
  const { tabs, activeFileId, setActive, closeTab } = useEditorStore();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<{ content: string | null; fileName: string }>({
    queryKey: ["filecontent", activeFileId],
    queryFn: () => getFileData(activeFileId!),
    enabled: !!activeFileId,
  });

  const [value, setValue] = useState("");
  const [dirtyMap, setDirtyMap] = useState<Record<string, boolean>>({});
  const cacheRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (!activeFileId) return;
    const cached = cacheRef.current.get(activeFileId);
    setValue(cached !== undefined ? cached : "");
  }, [activeFileId]);

  useEffect(() => {
    if (!data || !activeFileId) return;
    if (cacheRef.current.get(activeFileId) === undefined) {
      cacheRef.current.set(activeFileId, data.content ?? "");
      setValue(data.content ?? "");
    }
  }, [data, activeFileId]);

  const saveMutation = useMutation({
    mutationFn: () => updateFile(activeFileId!, value),
    onSuccess: () => {
      cacheRef.current.set(activeFileId!, value);
      queryClient.invalidateQueries({ queryKey: ["filecontent", activeFileId] });
      setDirtyMap((m) => ({ ...m, [activeFileId!]: false }));
    },
    onError: (e) => console.error("Save failed:", e.message),
  });

  const isDirty = activeFileId ? !!dirtyMap[activeFileId] : false;

  const handleChange = (newValue?: string) => {
    const v = newValue ?? "";
    setValue(v);
    cacheRef.current.set(activeFileId!, v);
    setDirtyMap((m) => ({ ...m, [activeFileId!]: v !== (data?.content ?? "") }));
  };

  const handleSave = () => {
    if (activeFileId && isDirty) saveMutation.mutate();
  };

  const handleRevert = () => {
    setValue(data?.content ?? "");
    cacheRef.current.set(activeFileId!, data?.content ?? "");
    setDirtyMap((m) => ({ ...m, [activeFileId!]: false }));
  };

  const handleCloseTab = (id: string) => {
    if (dirtyMap[id] && !window.confirm("Discard unsaved changes?")) return;
    closeTab(id);
  };

  const saveRef = useRef<() => void>(() => {});
  saveRef.current = handleSave;

  const handleMount = (editor: any, monaco: any) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => saveRef.current());
  };

  if (!activeFileId) {
    return (
      <div className="bg-[#111212] w-full text-2xl flex justify-center items-center text-[#eeeeee] h-full">
        <p>Select a <FileText className="inline -translate-y-0.5" /> file to view its content</p>
      </div>
    );
  }

  const activeTab = tabs.find((t) => t.id === activeFileId);

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] w-full overflow-hidden">
      <div className="tab-strip bg-[#1e1e1e] w-full flex items-center border-b border-white/20 justify-start overflow-x-auto shrink-0">
        {tabs.map((tab) => {
          const isActive = tab.id === activeFileId;
          return (
            <div
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-4 py-1 border-r border-[#eeeeee] cursor-pointer whitespace-nowrap shrink-0 ${
                isActive ? "bg-[#2d2d2d] text-white" : "text-[#9a9a9a] hover:bg-[#242424]"
              }`}
            >
              <FileIcon name={tab.name} size={14} />
              <span>{tab.name}</span>
              {dirtyMap[tab.id] && <span className="h-2 w-2 rounded-full bg-yellow-400" />}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTab(tab.id);
                }}
                className="text-[#9a9a9a] text-xs ml-1 hover:text-white"
              >
                ✕
              </button>
            </div>
          );
        })}

        <div className="ml-auto flex items-center gap-2 pr-2">
          {isDirty && (
            <button onClick={handleRevert} className="text-[#9a9a9a] hover:text-white text-sm px-2">
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!isDirty || saveMutation.isPending}
            className={`text-sm px-2 ${isDirty ? "text-white" : "text-[#5a5a5a]"}`}
          >
            {saveMutation.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="text-[#eeeeee] p-4">loading…</p>
      ) : error ? (
        <p className="text-[#eeeeee] p-4">error</p>
      ) : (
        <Editor
          height="100%"
          path={activeFileId}
          language={getLanguageFromFileName(activeTab?.name ?? "")}
          value={value}
          onChange={handleChange}
          theme="vs-dark"
          options={{ automaticLayout: true, minimap: { enabled: false } }}
          onMount={handleMount}
        />
      )}
    </div>
  );
};

export default FileEditor;
