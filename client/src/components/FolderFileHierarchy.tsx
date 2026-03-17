import React from "react"
import {FilePlus, FolderPlus} from "lucide-react"
import icons from "material-icon-theme/icons.json"
interface File{
    id: string;
    name: string;
}

interface Folder{
    id: string;
    name: string;
}

const FolderFileHierarchy: React.FC<{rootFolders: Folder[], rootFiles: File[], workspaceId: string}> = ({rootFolders, rootFiles, workspaceId})=>{
    return (
        <>
         <div className="flex flex-col">
            <div className="flex flex-row justify-between px-2 items-center">
                <div>name</div>
                <div className="flex flex-row gap-2">
                    <button><FilePlus size={18}  className="cursor-pointer  rounded-sm transition-all duration-200 hover:scale-110 "/></button>
                    <button><FolderPlus size={18} className="cursor-pointer  rounded-sm transition-all duration-200 hover:scale-110 "/></button>
                    <img src="/node_modules/material-icon-theme/icons/file.svg" alt="" />
                    
                </div>
            </div>
         </div>
        </>
    )
}


const FileComponent: React.FC<{}> = ()=>{
    return (
        <>

        </>
    )
}
export default FolderFileHierarchy;