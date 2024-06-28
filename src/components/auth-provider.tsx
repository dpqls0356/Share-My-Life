import { getRedirectResult } from "firebase/auth";
import { useEffect,   } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Firebase 인증 객체를 가져옵니다.

export default function  AuthProvider({children,}:{children:React.ReactNode}) {
    const navigate = useNavigate();
    useEffect(() => {
        //로그인된 유저는 접근할 수 없도록 처리
        const user = auth.currentUser;
        if(user){
            navigate("/");
        }
        // Firebase 리다이렉션 결과 처리
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    // 리디렉션 후 사용자가 있다면 메인 페이지로 이동
                    navigate("/");
                }
            })
            .catch((error) => {
                console.error("리디렉션 후 인증 오류:", error);
            });
    },[]);
    // 인증 상태에 따라 자식 컴포넌트 렌더링
    return children;
}
