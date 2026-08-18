import React, { useRef } from "react";
import { useResizeObserver } from "use-resize-observer";
import {
  Tree,
  TreeApi,
  CreateHandler,
  NodeRendererProps,
} from "react-arborist";
import {
  ChevronRight,
  File,
  FilePlus,
  FileText,
  Folder,
  FolderPlus,
  ListCollapse,
} from "lucide-react";
import icons from "material-icon-theme/icons.json";

interface File {
  id: string;
  name: string;
}

interface Folder {
  id: string;
  name: string;
}

function Node({ node, style, dragHandle }: NodeRendererProps<any>) {
  return (
    <div
      ref={dragHandle}
      style={style}
      onDoubleClick={() => node.edit()}
      onClick={() => node.isInternal && node.toggle()}
      className={`flex items-center text-[14px] px-2 py-1 outline-none focus:outline-none cursor-pointer gap-1 hover:bg-[#292929] ${node.isSelected ? "bg-[#292929]" : ""}`}
    >
      {/* folder arrow */}
      {node.isInternal ? (
        <ChevronRight
          size={18}
          className={`${node.isOpen ? "rotate-90" : ""}`}
        />
      ) : (
        <span className="w-4" />
      )}

      {/* icon */}
      {node.isInternal ? (
        <Folder size={16} className="text-gray-400 fill-gray-500" />
      ) : (
        <FileText size={16} className="text-gray-400" />
      )}

      {node.isEditing ? (
        <input
          type="text"
          defaultValue={node.data.name}
          autoFocus
          onFocus={(e) => e.target.select()}
          onBlur={(e) => {
            node.submit(e.currentTarget.value);
            node.select();
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") {
              node.submit(e.currentTarget.value);
              node.select();
              if (node.isInternal) {
                node.open();
              }
            }
            if (e.key === "Escape") node.reset();
          }}
        />
      ) : (
        <span>{node.data.name}</span>
      )}
    </div>
  );
}

const initdata = [
  {
    id: "1",
    name: "src",
    children: [
      { id: "2", name: "App.tsx" },
      { id: "3", name: "main.tsx" },
    ],
  },
  { id: "4", name: "package.json" },
  { id: "5", name: "README.md" },
];



const FolderFileHierarchy: React.FC<{
  rootFolders: Folder[];
  rootFiles: File[];
  workspaceId: string;
}> = ({ rootFolders, rootFiles, workspaceId }) => {
  const treeRef = useRef<TreeApi<any>>(null);
  const { ref, width, height } = useResizeObserver();

  const handleCreateFile = async () => {
    const selected = treeRef.current?.selectedNodes[0];

    if (!selected) {
      treeRef.current?.create({ type: "leaf", parentId: null });
    } else if (selected.isInternal) {
      if (!selected.isOpen) await selected.open();
      treeRef.current?.create({ type: "leaf", parentId: selected.id });
    } else {
      treeRef.current?.create({ type: "leaf", parentId: selected.parentId });
    }
  };

  const handleCreateFolder = async () => {
    const selected = treeRef.current?.selectedNodes[0];

    if (!selected) {
      treeRef.current?.create({ type: "internal", parentId: null });
    } else if (selected.isInternal) {
      if (!selected.isOpen) await selected.open();
      treeRef.current?.create({ type: "internal", parentId: selected.id });
    } else {
      treeRef.current?.create({
        type: "internal",
        parentId: selected.parentId,
      });
    }
  };
  const handleCollapseAll = () => {
    treeRef.current?.closeAll();
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      treeRef.current?.deselectAll();
    }
  };
  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex flex-row justify-between px-2 items-center">
          <div>Codebase</div>
          <div className="flex flex-row gap-2">
            <FilePlus
              onClick={handleCreateFile}
              size={18}
              className="cursor-pointer text-gray-400 hover:text-gray-200 rounded-sm transition-all duration-200 active:scale-110 "
            />
            <FolderPlus
              size={18}
              onClick={handleCreateFolder}
              className="cursor-pointer transition-all  text-gray-400 hover:text-gray-200 duration-200 active:scale-110 "
            />
            <ListCollapse
              size={18}
              onClick={handleCollapseAll}
              className="cursor-pointer  text-gray-400 hover:text-gray-200 rounded-sm transition-all duration-200 active:scale-110 "
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
              initialData={initdata}
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
    </>
  );
};

export default FolderFileHierarchy;
