import {create} from "zustand";
import {persist} from "zustand/middleware"
interface User{
    id: string;
    username: string;
    email: string;
    name?: string;
}

interface UserState{
    user: User | null;
    isAuthenticated: boolean | false;
    setUser: (user: User)=>void;
    reset: ()=>void;
}

const useUserStore = create<UserState>()(
    persist(
    (set)=>({
    user: null,
    isAuthenticated: false,

    setUser: (userData)=> set({user: userData, isAuthenticated: true}),
    reset: ()=>set({user: null, isAuthenticated: false})
    }),
    {
        name: "auth-storage",
    }

    )
);

export {useUserStore};