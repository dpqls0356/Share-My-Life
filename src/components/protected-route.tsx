import {Navigate} from "react-router-dom";
import {auth} from "../firebase.tsx";

export default function ProtectedRoute({children,}:{children:React.ReactNode}){
    //로그인된 유저 또는 null를 리턴한다.
    const user = auth.currentUser;
    if(!user){
        return <Navigate to="/login"/>
    }
    return children
}