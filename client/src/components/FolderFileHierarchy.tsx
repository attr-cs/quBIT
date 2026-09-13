import React, { useEffect, useRef, useState } from "react";
import { useResizeObserver } from "use-resize-observer";
import { useMutation } from "@tanstack/react-query";
import { createFile, createFolder } from "../api/file";
import { convertFileFolder } from "../utils/convertFileFolder";
import { useSearchParams } from "react-router-dom";
import {
  Tree,
  TreeApi,
  type CreateHandler,
  type NodeRendererProps,
  type RenameHandler,
  type NodeApi,
} from "react-arborist";
import {
  ChevronRight,
  FilePlus,
  FolderPlus,
  ListCollapse,
} from "lucide-react";
import { useUserStore } from "../store/authStore";
import { queryClient } from "../api/queryClient";
import { useEditorStore } from "../store/editorState";
import FileIcon from "./FileIcon";

const ARBORIST_ROOT_ID = "__REACT_ARBORIST_INTERNAL_ROOT__";

interface File {
  id: string;
  name: string;
}

interface Folder {
  id: string;
  name: string;
}

interface CreateFileResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    userId: string;
    workspaceId: string;
    folderId: string;
  };
}

interface CreateFileInput {
  name: string;
  folderId?: string | null;
}

interface TreeFolderNode {
  id: string | number;
  name: string;
  children: TreeNode[];
  parentId?: string | number | null;
  isTemp?: boolean;
  [key: string]: any;
}

interface TreeFileNode {
  id: string | number;
  name: string;
  parentId?: string | number | null;
  isTemp?: boolean;
  [key: string]: any;
}

type TreeNode = TreeFolderNode | TreeFileNode;

const isFolderNode = (node: TreeNode): node is TreeFolderNode =>
  "children" in node && Array.isArray(node.children);

let tempCounter = 0;
const nextTempId = () => `temp_${++tempCounter}`;

function getServerId(res: any): string | null {
  if (!res) return null;
  if (res.data?.data?.id) return res.data.data.id;
  if (res.data?.id) return res.data.id;
  return res.id ?? null;
}

function insertNode(
  nodes: TreeNode[],
  parentId: string | number | null | undefined,
  newNode: TreeNode
): { tree: TreeNode[]; inserted: boolean } {
  if (
    parentId === null ||
    parentId === undefined ||
    parentId === ARBORIST_ROOT_ID
  ) {
    return { tree: [...nodes, newNode], inserted: true };
  }

  let inserted = false;
  const tree = nodes.map((n) => {
    if (!isFolderNode(n)) return n;

    if (n.id === parentId) {
      inserted = true;
      return { ...n, children: [...(n.children || []), newNode] };
    }

    const result = insertNode(n.children || [], parentId, newNode);
    if (result.inserted) {
      inserted = true;
      return { ...n, children: result.tree };
    }

    return n;
  });

  return { tree, inserted };
}

function removeNode(nodes: TreeNode[], id: string | number): TreeNode[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) =>
      isFolderNode(n) ? { ...n, children: removeNode(n.children || [], id) } : n
    );
}

function collectTempNodes(nodes: TreeNode[]): TreeNode[] {
  const result: TreeNode[] = [];

  for (const n of nodes) {
    if (String(n.id).startsWith("temp_")) {
      result.push(n);
      if (isFolderNode(n)) result.push(...collectTempNodes(n.children || []));
    } else if (isFolderNode(n)) {
      result.push(...collectTempNodes(n.children || []));
    }
  }

  return result;
}

function EditInput({ node }: { node: NodeApi<any> }) {
  const done = useRef(false);

  return (
    <input
      type="text"
      defaultValue={node.data.name}
      autoFocus
      onFocus={(e) => e.target.select()}
      onBlur={(e) => {
        if (!done.current) node.submit(e.currentTarget.value);
      }}
      onKeyDown={(e) => {
        e.stopPropagation();

        if (e.key === "Enter") {
          done.current = true;
          node.submit(e.currentTarget.value);
        }

        if (e.key === "Escape") {
          done.current = true;
          node.reset();
        }
      }}
    />
  );
}

function Node({ node, style, dragHandle }: NodeRendererProps<any>) {
  const openFile = useEditorStore((s) => s.openFile);

  return (
    <div
      ref={dragHandle}
      style={style}
      onDoubleClick={() => node.edit()}
      onClick={() => {
        if (node.isInternal) {
          node.toggle();
        } else {
          openFile({ id: String(node.data.id), name: node.data.name });
        }
      }}
      className={`flex items-center text-[14px] px-2 py-1 outline-none focus:outline-none cursor-pointer gap-1 hover:bg-[#292929] ${
        node.isSelected ? "bg-[#292929]" : ""
      }`}
    >
      {node.isInternal ? (
        <ChevronRight
          size={18}
          className={`${node.isOpen ? "rotate-90" : ""}`}
        />
      ) : (
        <span className="w-4" />
      )}

      <FileIcon
        name={node.data.name}
        isFolder={node.isInternal}
        isOpen={node.isOpen}
        size={16}
      />

      {node.isEditing ? <EditInput node={node} /> : <span>{node.data.name}</span>}
    </div>
  );
}

const FolderFileHierarchy: React.FC<{
  rootFolders: Folder[];
  rootFiles: File[];
  workspaceId: string;
}> = ({ rootFolders, rootFiles, workspaceId }) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const userId = useUserStore((state) => state.user?.id);
  const treeRef = useRef<TreeApi<any>>(null);
  const committingRef = useRef<Set<string>>(new Set());
  const { ref, width, height } = useResizeObserver();

  const openFile = useEditorStore((s) => s.openFile);
  const activeFileId = useEditorStore((s) => s.activeFileId);
  const [searchParams, setSearchParams] = useSearchParams();
  const syncedRef = useRef(false);

  useEffect(() => {
    const converted = convertFileFolder(rootFiles, rootFolders);

    setTreeData((prev) => {
      let result = converted;

      for (const temp of collectTempNodes(prev)) {
        const { tree, inserted } = insertNode(result, temp.parentId, temp);
        result = inserted ? tree : [...result, temp];
      }

      return result;
    });
  }, [rootFiles, rootFolders]);

  useEffect(() => {
    const urlFile = searchParams.get("file");
    if (urlFile && urlFile !== activeFileId) {
      const f = rootFiles.find((x) => x.id === urlFile);
      openFile({ id: urlFile, name: f?.name ?? "" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!syncedRef.current) {
      syncedRef.current = true;
      return;
    }

    const urlFile = searchParams.get("file");
    if (activeFileId === urlFile) return;

    if (activeFileId) {
      setSearchParams({ file: activeFileId }, { replace: true });
    } else if (urlFile) {
      setSearchParams({}, { replace: true });
    }
  }, [activeFileId, searchParams, setSearchParams]);

  const createfileMutation = useMutation<
    CreateFileResponse,
    Error,
    CreateFileInput
  >({
    mutationFn: async ({ name, folderId }: CreateFileInput) =>
      createFile(name, workspaceId, userId!, folderId || null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
    },
    onError: (error) => {
      console.error("Failed to create file: ", error.message);
    },
  });

  const createfolderMutation = useMutation<
    CreateFileResponse,
    Error,
    CreateFileInput
  >({
    mutationFn: async ({ name, folderId }: CreateFileInput) =>
      createFolder(name, workspaceId, userId!, folderId || null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspace", workspaceId] });
    },
    onError: (error) => {
      console.error("Failed to create folder: ", error.message);
    },
  });

  const handleSelect = (nodes: NodeApi<any>[]) => {
    const n = nodes[0];

    if (!n) {
      setSelectedId(null);
      return;
    }

    setSelectedId(n.id);

    if (n.isInternal) {
      setActiveFolderId(n.id);
    } else if (n.parent && n.parent.id !== ARBORIST_ROOT_ID) {
      setActiveFolderId(n.parent.id);
    } else {
      setActiveFolderId(null);
    }
  };

  const handleCreate: CreateHandler<any> = ({ parentId, type }) => {
    const newNode: TreeNode = {
      id: nextTempId(),
      name: type === "internal" ? "New Folder" : "New File",
      isTemp: true,
      parentId: parentId ?? null,
      ...(type === "internal" ? { children: [] as TreeNode[] } : {}),
    };

    setTreeData((prev) => {
      const { tree, inserted } = insertNode(prev, parentId, newNode);
      return inserted ? tree : [...prev, newNode];
    });

    return newNode;
  };

  const handleUpdate: RenameHandler<any> = async ({ id, name, node }) => {
    const key = String(id);

    if (!key.startsWith("temp_")) return;
    if (committingRef.current.has(key)) return;

    committingRef.current.add(key);

    try {
      const trimmed = name.trim();

      if (!trimmed) {
        setTreeData((prev) => removeNode(prev, id));
        return;
      }

      const parentId =
        node.data.parentId != null
          ? node.data.parentId
          : node.parent && node.parent.id !== ARBORIST_ROOT_ID
          ? node.parent.id
          : null;

      let res;
      if (node.isInternal) {
        res = await createfolderMutation.mutateAsync({
          name: trimmed,
          folderId: parentId,
        });
      } else {
        res = await createfileMutation.mutateAsync({
          name: trimmed,
          folderId: parentId,
        });
      }

      const realId = getServerId(res) ?? key;

      setTreeData((prev) =>
        insertNode(
          removeNode(prev, id),
          parentId,
          {
            id: realId,
            name: trimmed,
            ...(node.isInternal ? { children: [] as TreeNode[] } : {}),
          } as TreeNode
        ).tree
      );

      if (node.isInternal) {
        setActiveFolderId(realId);
        setSelectedId(realId);
      } else {
        setActiveFolderId(parentId);
        setSelectedId(realId);
      }

      setTimeout(() => {
        treeRef.current?.select(realId);
      }, 0);
    } catch (e) {
      setTreeData((prev) => removeNode(prev, id));
    } finally {
      committingRef.current.delete(key);
    }
  };

  const createInside = (type: "leaf" | "internal") => {
    const target = activeFolderId ? treeRef.current?.get(activeFolderId) : null;

    if (target && target.isInternal) {
      if (!target.isOpen) treeRef.current?.open(target.id);
      treeRef.current?.create({ type, parentId: target.id });
      return;
    }

    const selected = treeRef.current?.selectedNodes[0];

    if (selected?.isInternal) {
      if (!selected.isOpen) treeRef.current?.open(selected.id);
      treeRef.current?.create({ type, parentId: selected.id });
    } else if (selected && selected.parent && selected.parent.id !== ARBORIST_ROOT_ID) {
      treeRef.current?.create({ type, parentId: selected.parent.id });
    } else {
      treeRef.current?.create({ type, parentId: null });
    }
  };

  const handleCreateFile = () => createInside("leaf");
  const handleCreateFolder = () => createInside("internal");

  const handleCollapseAll = () => {
    treeRef.current?.closeAll();
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      treeRef.current?.deselectAll();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-row justify-between px-2 items-center">
        <div>Codebase</div>
        <div className="flex flex-row gap-2">
          <FilePlus
            onClick={handleCreateFile}
            size={18}
            className="cursor-pointer text-gray-400 hover:text-gray-200 rounded-sm transition-all duration-200 active:scale-110"
          />
          <FolderPlus
            size={18}
            onClick={handleCreateFolder}
            className="cursor-pointer transition-all text-gray-400 hover:text-gray-200 duration-200 active:scale-110"
          />
          <ListCollapse
            size={18}
            onClick={handleCollapseAll}
            className="cursor-pointer text-gray-400 hover:text-gray-200 rounded-sm transition-all duration-200 active:scale-110"
          />
        </div>
      </div>

      <div
        ref={ref}
        onClick={handleContainerClick}
        className="h-full pl-5 flex-1 min-h-0 w-full my-4"
      >
        {width && height ? (
          <Tree
            ref={treeRef}
            onCreate={handleCreate}
            data={treeData}
            onRename={handleUpdate}
            onSelect={handleSelect}
            selection={selectedId}
            openByDefault={false}
            width={width}
            height={height}
            rowHeight={32}
            indent={16}
          >
            {Node}
          </Tree>
        ) : null}
      </div>
    </div>
  );
};

export default FolderFileHierarchy;
