import React from "react";

import { getWorkspaces } from "../api/workspace";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import WorkspaceCreate from "../components/WorkspaceCreate";
import WorkspaceRequests from "../components/WorkspaceRequests";
// import MyWorkspaces from "../components/MyWorkspaces";
import { useUserStore } from "../store/authStore";
import LoadingScreen from "../components/skeletons/WorkspacePageSkeleton";
import LogoutButton from "../components/LogoutButton";
import { Bell, EllipsisVertical, Lock } from "lucide-react";
import NotificationBell from "../components/NotificationBell";

interface Workspaces {
  id: string;
  name: string;
  isPrivate: boolean;
  isJoined: boolean;
  createdAt: string;
  owner: {
    username: string;
  };
  _count: {
    members: number;
  };
}

const WorkspacesListPage: React.FC = () => {
  const lgid = useUserStore((state) => state.user?.id);
  const navigate = useNavigate();
  const {
    data: workspaces,
    isLoading,
    isError,
    error,
  } = useQuery<Workspaces[]>({
    queryKey: ["workspaces", lgid], // lg means id of logged in user
    queryFn: getWorkspaces,
  });

  // if(isSuccess) {console.log(workspaces); return null;}
  if (isLoading) return <LoadingScreen />;
  if (isError) return <p>{(error as Error).message}</p>;
  if (!workspaces) return null;
  return (

    // #0a0d12
    <div className="bg-[#000000] relative font-space flex justify-center items-center text-slate-100 min-h-screen w-full">
      {/* left side */}
      <div className="bg-[#111111] z-10 flex py-7 fixed top-0 left-0 items-center justify-between flex-col w-15 min-h-screen">
        <div>
          <WorkspaceCreate />
        </div>
        <div className="flex flex-col items-center gap-2">
            <NotificationBell/>
            <LogoutButton/>
            <div className="rounded-full w-6 h-6 bg-blue-100 cursor-pointer"></div>
        </div>
      </div>

      {/* right side */}
      <div className=" flex-1 flex justify-around px-50 mt-30  flex-col min-h-screen">

      
        <div className="w-full  ">
            <h1 className="text-xl my-4 text-[#ffffff]" >My Workspaces</h1>
            <div className="grid grid-cols-5">

            {workspaces.map((workspace: Workspaces) => {
              if (workspace.isJoined) {
                return  (
                    

                    <Link key={workspace.id} className="relative bg-[#111111] shadow-2xl border-2 border-[#eeeeee]/30   w-50 h-30 m-2 hover:border-slate-400 duration-75  transition-all" to={`/workspace/${workspace.id}`}>

                    <EllipsisVertical size={14} className="m-3 absolute text-[#a3a3a3] right-0 top-0"></EllipsisVertical>

                      {workspace.isPrivate && <Lock size={14} className="m-3 text-[#a3a3a3] absolute right-0 bottom-0"></Lock>}
                    
                        <span className="font-sans truncate px-8 text-xs block w-full text-center mt-2 underline  text-gray-300">{workspace.name}</span>
                    
                      <span className="font-sans text-[10px] truncate flex gap-1 items-center w-full m-2 absolute bottom-0 text-gray-300"><div className="w-3 h-3 rounded-full bg-slate-400"></div>@{workspace.owner.username}</span>

                    </Link>
                    
                )
            }
            })}

            </div>
        </div>
        <div>
              <h1 className="text-xl my-4 text-[#ffffff]" >Other Workspaces</h1>
            <div className="grid grid-cols-5">
        

            {workspaces.map((workspace: Workspaces) => {
              if (!workspace.isJoined) {
                return  (
                    

                    <Link className="relative bg-[#111111] shadow-2xl border-2   w-50 h-30 m-2  border-[#262626] hover:border-slate-500 duration-75 transition-all" to={`/workspace/${workspace.id}`}>

                    <EllipsisVertical size={14} className="m-3 text-[#a3a3a3] absolute right-0 top-0"></EllipsisVertical>

                      {workspace.isPrivate && <Lock size={14} className="m-3 text-[#a3a3a3] absolute right-0 bottom-0"></Lock>}
                    
                      <span className="font-sans text-xs block w-full text-center mt-2 underline  text-gray-300">{workspace.name}</span>
                    
                      <span className="font-sans text-[10px] flex gap-1 items-center w-full m-2 absolute bottom-0 text-gray-300"><div className="w-3 h-3 rounded-full bg-slate-400"></div>@{workspace.owner.username}</span>
                      
                    </Link>
                    
                )
            }
            })}
          </div>
        </div>
      </div>
    </div>
    // <div className="lg:px-20 md:px-10 px-4 py-5 flex flex-col ">
    //   {/* <p className="mt-14">Workspace</p>  */}
    //   <div className="flex justify-center mt-25 ">
    //     <div>
    //       <h2 className="my-2">My Workspaces</h2>
    //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row gap-5 ">
    //         <WorkspaceCreate />

    //         {/* <MyWorkspaces /> */}

    //         {workspaces.map((workspace: Workspaces) => {
    //           if (workspace.isJoined) {
    //             return (
    //               <div
    //                 className={`aspect-square flex flex-col font-sans shadow-sm bg-brand-card w-40 h-40 text-sm rounded-md text-brand-write font-semibold hover:shadow-sm  group/card `}
    //                 key={workspace.id}
    //                 onClick={() => navigate(`/workspace/${workspace.id}`)}
    //               >
    //                 {/* <div>{new Date(workspace.createdAt).toLocaleDateString()}</div> */}
    //                 <div className="flex p-3 justify-between">
    //                   <div>{workspace.isPrivate ? "" : "🌍Public"}</div>
    //                   {/* <div className="  italic text-semibold">@{workspace.owner.username}</div> */}
    //                 </div>
    //                 {/* <div>{workspace.isJoined ? "Joined" : "Not Joined"}</div> */}
    //                 {/* <div>{workspace._count.members}</div> */}

    //                 <div
    //                   className="border-t-2 mt-auto text-xs py-2 text-left cursor-pointer hover:font-semibold pl-2 truncate capitalize border-t-brand-surface group-hover/card:text-[#636363]"
    //                   title={workspace.name}
    //                 >
    //                   {workspace.name}
    //                 </div>
    //               </div>
    //             );
    //           }
    //         })}
    //       </div>
    //       <h2 className="my-2 mt-5">Workspaces</h2>
    //       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 grid-flow-row gap-5 ">
    //         {workspaces.map((workspace: Workspaces) => {
    //           if (!workspace.isJoined) {
    //             return (
    //               <div
    //                 className={`aspect-square flex flex-col font-sans shadow-sm bg-brand-card w-40 h-40 text-sm rounded-md text-brand-write font-semibold group/card hover:shadow-sm`}
    //                 key={workspace.id}
    //                 onClick={() => navigate(`/workspace/${workspace.id}`)}
    //               >
    //                 {/* <div>{new Date(workspace.createdAt).toLocaleDateString()}</div> */}
    //                 <div className="flex p-3 justify-between">
    //                   <div>{workspace.isPrivate ? "" : "🌍Public"}</div>
    //                   {/* <div className="  italic text-semibold">@{workspace.owner.username}</div> */}
    //                 </div>
    //                 {/* <div>{workspace.isJoined ? "Joined" : "Not Joined"}</div> */}
    //                 {/* <div>{workspace._count.members}</div> */}

    //                 <div
    //                   className="border-t-2 mt-auto text-xs py-2 cursor-pointer group-hover/card:text-[#636363] text-left pl-2 truncate capitalize border-t-brand-surface "
    //                   title={workspace.name}
    //                 >
    //                   {workspace.name}
    //                 </div>
    //               </div>
    //             );
    //           }
    //         })}
    //       </div>
    //     </div>
    //   </div>
    //   <LogoutButton />

    //   <WorkspaceRequests />
    // </div>
  );
};

export default WorkspacesListPage;
