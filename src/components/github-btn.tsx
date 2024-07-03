import {styled} from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGithub} from "@fortawesome/free-brands-svg-icons"
import { GithubAuthProvider,signInWithPopup,signInWithRedirect } from "firebase/auth";
import {auth} from "../firebase";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { onAuthStateChanged,getRedirectResult } from "firebase/auth";
import { useNavigate } from "react-router-dom"

const Button = styled.button`
    margin-top:10px;
    font-size: 16px;
    width: 100%;
    background-color:var(--color-gray);
    border: none;
    color:black;
    cursor: pointer;
    &:hover {
      background-color:#e0dede;
    }
    gap: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 13px 20px;
`

export default function GithubButton(){
    //github을 통한 로그인
    const [error,setError] = useState("");
    const navigate = useNavigate();
    const onClick = async()=>{
        setError("")
        try{
            const provider = new GithubAuthProvider();

            //팝업창을 통한 로그인
            await signInWithPopup(auth,provider);

            //리다이렉션을 통한 로그인
            // await signInWithRedirect(auth,provider);
            navigate("/");
        }catch(e){
            if (e instanceof FirebaseError) {
                // Firebase 에러 코드에 따른 메시지 설정
                setError("login error");
                console.log(e); 
            }
        }
       }
    return <Button onClick={onClick}>
    <FontAwesomeIcon icon={faGithub} />
        Continue With Github
    </Button>
}