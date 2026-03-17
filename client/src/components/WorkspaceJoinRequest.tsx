import React, { useState } from "react";
import { joinWorkspaceRequest } from "../api/workspace";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Send, CheckCircle } from "lucide-react";



const WorkspaceJoinRequest:React.FC<{workspaceId: string}> = ({workspaceId})=>{
    const [sent, setSent]= useState<boolean>(false);
    const joinMutation = useMutation<any, any>({
        mutationFn: async()=>joinWorkspaceRequest( workspaceId),
        onSuccess: (data)=>{
             if(data.success){
                setSent(true);
            }
        },
        onError: (err)=>{
            alert("Request not made")
        }
    })

    const handleClick = ()=>{
        joinMutation.mutate();
    }
    return (
        <div className="w-full">
            {!sent ? (
                <button
                    onClick={handleClick}
                    disabled={joinMutation.isPending}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 
                             bg-brand-bright text-brand-deep font-bold rounded-xl
                             hover:bg-white active:scale-95 transition-all 
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {joinMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Request Access
                        </>
                    )}
                </button>
            ) : (
                <div className="flex items-center justify-center gap-2 py-3 px-6 
                                bg-emerald-500/10 cursor-pointer border border-emerald-500/20 
                                text-emerald-500 rounded-xl font-bold animate-in fade-in zoom-in-95">
                    <CheckCircle className="w-5 h-5" />
                    Request Sent
                </div>
            )}
        </div>
    )
}

export default WorkspaceJoinRequest;