import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getJoinRequests } from "../api/workspace";
import { useUserStore } from "../store/authStore";
import ApproveJoinRequestButton from "./ApproveJoinRequestButton";
import { User, Folder, Clock, Bell } from "lucide-react";

interface joinRequests {
    id: string;
    userId: string;
    workspaceId: string;
    user: { username: string };
    workspace: { name: string };
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
}

const WorkspaceRequests: React.FC = () => {
    const lgid = useUserStore(state => state.user?.id);
    const { data: requests, isLoading, isError } = useQuery<joinRequests[]>({
        queryKey: ["join-requests", lgid],
        queryFn: getJoinRequests,
    });

    if (isLoading) return <div className="animate-pulse text-brand-muted text-xs p-4">Loading requests...</div>;
    if (isError) return <p className="text-red-400 text-xs">Error loading requests</p>;
    
    // Hide section if no requests
    if (!requests || requests.length === 0) return null;

    return (
        <section className="mt-10 mb-6">
            <div className="flex items-center gap-2 mb-4 px-2">
                <Bell size={14} className="text-indigo-400" />
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted">
                    Pending Invitations ({requests.length})
                </h2>
            </div>

            <div className="space-y-3">
                {requests.map((r) => (
                    <div 
                        key={r.id} 
                        className="flex items-center justify-between p-4 bg-brand-card border border-brand-border/10 rounded-xl hover:border-brand-border/30 transition-all shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            {/* Avatar Placeholder */}
                            <div className="w-10 h-10 rounded-full bg-brand-surface flex items-center justify-center text-brand-bright border border-brand-border/20">
                                <User size={18} />
                            </div>

                            <div className="flex flex-col">
                                <p className="text-sm font-semibold text-brand-bright">
                                    @{r.user?.username} 
                                    <span className="font-normal text-brand-muted ml-1">requested to join</span>
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 uppercase tracking-tighter">
                                        <Folder size={12} />
                                        {r.workspace?.name}
                                    </span>
                                    <span className="flex items-center gap-1 text-[11px] text-brand-muted">
                                        <Clock size={12} />
                                        {new Date(r.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                            {/* You could add a Reject button here later */}
                            <ApproveJoinRequestButton workspaceId={r.workspaceId} requestId={r.id} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WorkspaceRequests;