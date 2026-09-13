interface FileItem {
  id: string | number;
  name: string;
  folderId?: string | number | null;
}

interface FolderItem {
  id: string | number;
  name: string;
  parentId?: string | number | null;
}

interface FileNode {
  id: string | number;
  name: string;
}

interface FolderNode {
  id: string | number;
  name: string;
  children: (FolderNode | FileNode)[];
}

type TreeNode = FolderNode | FileNode;

function convertFileFolder(
  files: FileItem[] = [],
  folders: FolderItem[] = []
): TreeNode[] {
  const rootNodes: TreeNode[] = [];
  const folderMap = new Map<string | number, FolderNode>();

 
  folders.forEach((folder) => {
    folderMap.set(folder.id, {
      id: folder.id,
      name: folder.name,
      children: [],
    });
  });

  folders.forEach((folder) => {
    const node = folderMap.get(folder.id);
    if (!node) return;

    if (folder.parentId && folderMap.has(folder.parentId)) {
      folderMap.get(folder.parentId)!.children.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  files.forEach((file) => {
    const fileNode: FileNode = {
      id: file.id,
      name: file.name,
    };

    if (file.folderId && folderMap.has(file.folderId)) {
      folderMap.get(file.folderId)!.children.push(fileNode);
    } else {
      rootNodes.push(fileNode);
    }
  });

  const isFolderNode = (node: TreeNode): node is FolderNode => {
    return 'children' in node && Array.isArray(node.children);
  };
  
  const sortNodes = (nodes: TreeNode[]): void => {
    nodes.sort((a, b) => {
      const aIsFolder = isFolderNode(a);
      const bIsFolder = isFolderNode(b);

      if (aIsFolder && !bIsFolder) return -1;
      if (!aIsFolder && bIsFolder) return 1;
      
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });

    nodes.forEach((node) => {
      if (isFolderNode(node) && node.children.length > 0) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(rootNodes);

  return rootNodes;
}

export { convertFileFolder };
