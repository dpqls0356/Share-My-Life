import {auth} from "../firebase.tsx";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate,Navigate } from "react-router-dom";
export default function ProtectedRoute({children,}:{children:React.ReactNode}){
    //로그인된 유저 또는 null를 리턴한다.
    const navigate = useNavigate();

    useEffect(() => {
        // 인증 상태 변경 감지  
        onAuthStateChanged(auth, (user) => {
            if (user === null) {
                navigate("/login")
                return null;
            }});
        }, [navigate]);

    return children;
}