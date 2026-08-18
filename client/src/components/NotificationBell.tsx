import { Bell } from "lucide-react";
import type React from "react";

const NotificationBell: React.FC = ({})=>{

    return (
        <div className="rounded-full  cursor-pointer w-10 h-10 flex hover:bg-slate-900 transition-colors justify-center items-center">
      <Bell  size={20} className=" text-[#ffffff]"/>
    </div>
    )

}

export default NotificationBell;