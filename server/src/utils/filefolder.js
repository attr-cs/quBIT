
function convertFileFolder(files = [], folders = []) {
  const rootNodes = [];
  const folderMap = new Map();

  folders.forEach((folder) => {
    folderMap.set(folder.id, {
      id: folder.id,
      name: folder.name,
      children: [],
    });
  });

  folders.forEach((folder) => {
    const node = folderMap.get(folder.id);
    if (folder.parentId && folderMap.has(folder.parentId)) {
      folderMap.get(folder.parentId).children.push(node);
    } else {
      rootNodes.push(node);
    }
  });

  files.forEach((file) => {
    const fileNode = {
      id: file.id,
      name: file.name,
    };

    if (file.folderId && folderMap.has(file.folderId)) {
      folderMap.get(file.folderId).children.push(fileNode);
    } else {
      rootNodes.push(fileNode);
    }
  });

  const sortNodes = (nodes) => {
    nodes.sort((a, b) => {
      const aIsFolder = Array.isArray(a.children);
      const bIsFolder = Array.isArray(b.children);

      if (aIsFolder && !bIsFolder) return -1;
      if (!aIsFolder && bIsFolder) return 1;
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });

    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(rootNodes);

  return rootNodes;
}

module.exports = { convertFileFolder };