import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinRequestApprove } from "../api/workspace";
import { useUserStore } from "../store/authStore";
import { Loader2, Check } from "lucide-react";

interface ApproveRequest {
    workspaceId: string;
    requestId: string;
}

const ApproveJoinRequestButton: React.FC<ApproveRequest> = ({ workspaceId, requestId }) => {
    const queryClient = useQueryClient();
    const userId = useUserStore(state => state.user?.id);

    const approveMutation = useMutation({
        mutationFn: () => joinRequestApprove(workspaceId, requestId),
        onSuccess: (data) => {
            if (data.success) {
                // 1. Remove the request from the "Pending Invitations" list
                queryClient.invalidateQueries({ queryKey: ["join-requests", userId] });
                
                // 2. Refresh the workspace list so the new workspace shows up in "My Workspaces"
                queryClient.invalidateQueries({ queryKey: ["workspaces", userId] });
            }
        },
        onError: (err: any) => {
            alert(err.response?.data?.message || "Could not approve request");
        }
    });

    return (
        <button
            onClick={() => approveMutation.mutate()}
            disabled={approveMutation.isPending || approveMutation.isSuccess}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs transition-all active:scale-95
                ${approveMutation.isSuccess 
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default" 
                    : "bg-brand-bright text-brand-deep hover:bg-white border border-transparent shadow-lg shadow-black/20"
                } 
                disabled:opacity-50`}
        >
            {approveMutation.isPending ? (
                <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Processing...
                </>
            ) : approveMutation.isSuccess ? (
                <>
                    <Check className="w-3 h-3" />
                    Approved
                </>
            ) : (
                "Approve Access"
            )}
        </button>
    );
};

export default ApproveJoinRequestButton;