  import { useParams } from "react-router-dom";
  import { getWorkspaceById, renameWorkspace } from "../api/workspace";
  import { useMutation, useQuery } from "@tanstack/react-query";
  import { useState, useEffect } from "react";
  import { queryClient } from "../api/queryClient";
  import { useUserStore } from "../store/authStore";
  // import { Lock, AlertCircle, EllipsisVertical } from "lucide-react";
  import JoinPublicWorkspace from "../components/JoinPublicWorkspace";
  import ToggleWorkspacePublicButton from "../components/ToggleWorkspacePublicButton";
  import JoinPrivateWorkspace from "../components/JoinPrivateWorkspace";
  import { Group, Panel, Separator } from "react-resizable-panels";
  import FolderFileHierarchy from "../components/FolderFileHierarchy";

  // import FolderFileHierarchy from "../components/FolderFileHierarchy"

  // import GoBack from "../components/GoBack"

  interface User {
    id: string;
    username: string;
  }
  interface File {
    id: string;
    name: string;
  }

  interface Member {
    user: User;
    role: "ADMIN" | "EDITOR" | "VIEWER";
  }
  interface Folder {
    id: string;
    name: string;
  }
  interface joinRequest {
    userId: string;
    workspaceId: string;
  }

  interface WorkspaceResponse {
    id: string;
    name: string;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
    owner: User;
    joinRequests: joinRequest[];
    members: Member[];
    files: File[];
    folders: Folder[];
  }

  interface RenameWorkspaceResponse {
    success: string;
    message: string;
    data: {
      name: string;
    };
  }
  const WorkspacePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [workName, setWorkName] = useState<string>("");

    const userId = useUserStore((state) => state.user?.id);
    const {
      data: workspace,
      isLoading,
      isError,
      error,
    } = useQuery<WorkspaceResponse>({
      queryKey: ["workspace", id],
      queryFn: async () => getWorkspaceById(id!),
      enabled: !!id,
      retry: false,
    });

    const renameMutation = useMutation<RenameWorkspaceResponse, Error, string>({
      mutationFn: async (newName: any) => renameWorkspace(id!, newName),
      onSuccess: (data) => {
        if (data.success) {
          queryClient.invalidateQueries({ queryKey: ["workspace", id] });
          queryClient.invalidateQueries({ queryKey: ["workspaces", userId] });
        } 
      },
      onError: (err) => {
        alert("error renaming the workspace");
      },
    });

    const handleRename = () => {
      const trimmed = workName.trim();
      if (trimmed && trimmed !== workspace?.name) {
        renameMutation.mutate(trimmed);
      } else {
        setWorkName(workspace?.name || "");
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>)=>{
      if(e.key === "Enter"){
        e.currentTarget.blur();
        handleRename();
      }else if(e.key === "Escape"){
        setWorkName(workspace?.name || "");
        e.currentTarget.blur();
      }
    }
    useEffect(() => {
      setWorkName(workspace?.name || "");
    }, [workspace?.name]);

    if (isLoading) return <p>loading..</p>;
    if (isError) {
      let status = (error as any)?.response?.status;
      if (status === 401) {
        return <p>Session expired. Please login again.</p>;
      }

      if (status === 403) {
        const code = (error as any)?.response?.data?.code;

        if (code == "JOIN_REQUIRED") {
          return <JoinPublicWorkspace workspaceId={id} userId={userId} />;
        }
        return (
          <JoinPrivateWorkspace
            workspaceId={id}
            isAlreadyRequested={code !== "REQUEST_PENDING" ? false : true}
          />
        );
      }

      if (status === 404) {
        return <p>Workspace not found.</p>;
      }

      if (status === 500) {
        return <p>Server error. Please try later.</p>;
      }
      return <p>{(error as any)?.response.message}</p>;
    }
    if (!workspace) return null;
    return (
      <div className="flex flex-col font-space h-screen">
        {/* <GoBack /> */}

  {/* top bar */}
        <div className="flex items-center  py-3 bg-[#111111] border-b-[#eeeeee]/20 border-b text-[#a3a3a3]">
        <input
                type="text"
                onBlur={handleRename}
                onKeyDown={handleKeyDown}
                disabled={renameMutation.isPending}
                className={`outline-none truncate w-fit text-center mx-5 capitalize border-b-2  ${renameMutation.isPending ? "border-b-[#cbd2d9]" : "border-b-transparent focus:border-b-[#e4e7eb]"}`}
                // className={`outline-none truncate text-center rounded-2xl border-[#eeeeee] border-2 w-[50%] capitalize ${renameMutation.isPending ? "border-b-[#cbd2d9]" : "border-b-transparent focus:border-b-[#e4e7eb]"} `}
                value={workName}
                onChange={(e) => setWorkName(e.target.value)}
                placeholder="Workspace name"
              />
          <ToggleWorkspacePublicButton
          isPrivate={workspace.isPrivate}
          workspaceId={id!}
        />
        </div>


        <Group  className="flex-1 min-h-0">
          <Panel defaultSize={18} minSize={15}>
            <div className="h-full bg-[#1a1a1a] text-white overflow-auto py-6 px-2 flex flex-col">
              
              
              <FolderFileHierarchy
                rootFolders={workspace.folders}
                rootFiles={workspace.files}
                workspaceId={workspace.id}
              />
            </div>
          </Panel>

          <Separator className=" focus:outline-none hover:bg-slate-400 cursor-col-resize" />
          <Panel defaultSize={65} minSize={15}>
            <div className="h-full bg-[#111212] overflow-auto">file.jsx</div>
          </Panel>
        </Group>
      </div>
    );
  };

  export default WorkspacePage;
