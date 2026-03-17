import React from "react";
import WorkspaceJoinRequest from "./WorkspaceJoinRequest";

const JoinPrivateWorkspace: React.FC<{workspaceId: string}> = ({workspaceId})=>{
    return (
        <div className="min-h-screen bg-brand-deep flex items-center justify-center p-6">
            <div className="max-w-md w-full space-y-8 text-center">
                
                
                <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full animate-pulse"></div>
                    <div className="relative flex items-center justify-center w-full h-full bg-brand-card border border-brand-border/30 rounded-3xl shadow-2xl">
                        <Lock className="w-10 h-10 text-amber-500" />
                    </div>
                </div>

                
                <div className="space-y-3">
                    <h2 className="text-3xl font-black tracking-tight text-brand-bright">
                        Private Access Only
                    </h2>
                    <p className="text-brand-muted leading-relaxed font-medium">
                        You've reached a private workspace. You must be a member or have an approved request to view the contents of <span className="text-brand-bright font-bold">Qubit</span>.
                    </p>
                </div>

                
                <div className="bg-brand-card/50 border border-brand-border/20 p-6 rounded-2xl space-y-6">
                    <div className="flex items-start gap-3 text-left p-3 bg-brand-surface/30 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-brand-muted mt-0.5" />
                        <p className="text-xs text-brand-muted font-medium">
                            Once you request access, the workspace owner will be notified to review your profile.
                        </p>
                    </div>
                    
                    <WorkspaceJoinRequest workspaceId={id!} />
                </div>

                <div className="pt-4">
                    <GoBack /> 
                   
                </div>
            </div>
        </div>
    )
}


export default JoinPrivateWorkspace;