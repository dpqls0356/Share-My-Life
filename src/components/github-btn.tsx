import {styled} from "styled-components";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGithub} from "@fortawesome/free-brands-svg-icons"
import { GithubAuthProvider, signInWithRedirect } from "firebase/auth";
import {auth} from "../firebase";
import { useState,useEffect } from "react";
import { FirebaseError } from "firebase/app";
import { onAuthStateChanged,getRedirectResult } from "firebase/auth";
import { useNavigate } from "react-router-dom"

const Button = styled.button`
    font-size: 16px;
    width: 100%;
    background-color:white;
    border: 1px solid #1d9bf0;
    color:#1d9bf0;
    cursor: pointer;
    &:hover {
      background-color:#1d9bf0;
      color:white;
    }
    border-radius: 50px;
    gap: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
`

export default function GithubButton(){
    //github을 통한 로그인
    const [error,setError] = useState("");
    const onClick = async()=>{
        setError("")
        try{
            const provider = new GithubAuthProvider();

            //팝업창을 통한 로그인
            // await signInWithPopup(auth,provider);

            //리다이렉션을 통한 로그인
            await signInWithRedirect(auth,provider);
        }catch(e){
            if (e instanceof FirebaseError) {
                // Firebase 에러 코드에 따른 메시지 설정
                setError("login error");
            }
        }
    }
    return <Button onClick={onClick}>
    <FontAwesomeIcon icon={faGithub} />
        Continue With Github
    </Button>
}