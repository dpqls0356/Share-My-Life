import {useState,useEffect } from "react"
import {auth} from "../firebase.tsx";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword } from "firebase/auth";
import {Wrapper,Title,Form,Input,Switcher,Error,Divide, Line,Text} from "../components/auth-components.ts"
import GithubButton from "../components/github-btn.tsx";

export default function Login(){
    const [loading,setLoading] = useState(false);
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();
    const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {
            target:{name,value},
        }=e;
         if(name==="password"){
            setPassword(value);
        }
        else if(name==="email"){
            setEmail(value);
        }
    }
    const onSumbit = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError("");
        // 사용자가 정보를 전부 입력하지않은 경우와 이미 요청이 보내졌을 때 다시 요청을 보내는 것을 막음
        if(loading||email===""||password==="")return;
        try{
            //중요 : 로그인 가능여부 판단에 들어갔음을 판단하기 위함
            setLoading(true);
            await signInWithEmailAndPassword(auth,email,password)
            navigate("/");
        }catch(e){
            if (e instanceof FirebaseError) {
                // Firebase 에러 코드에 따른 메시지 설정
                console.log(e)
                setError(errors[e.code as keyof typeof errors] || "An unexpected error occurred. Please try again.");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }finally{
            //중요 : 과정을 다 거친 경우 false로 변경
            setLoading(false);
        }
    }
    const errors={
        "auth/invalid-email": "유효하지 않은 이메일입니다.",
        "auth/user-disabled": "해당 사용자는 비활성화되었습니다.",
        "auth/user-not-found": "해당 사용자가 존재하지 않습니다.",
        "auth/wrong-password": "비밀번호가 잘못되었습니다."
    }
    // useEffect(()=>{
    //     const user = auth.currentUser;
    //     if(user!==null){
    //         navigate("/");
    //     }
    // },[])
    return(
        <Wrapper>
            <Title>Login</Title>
            {error!==""?<Error>{error}</Error>:null}
            <Form onSubmit={onSumbit}>
                <Input onChange={onChange} value={email} name="email" placeholder="Email" type="email" required/>
                <Input onChange={onChange} value={password} name="password" placeholder="Password" type="password" required/>
                <Input type="submit" value={loading?"Loading...":"Login"}/>
            </Form>
            <Divide>
                <Line></Line>
                <Text>또는</Text>
                <Line></Line>
            </Divide>
            <GithubButton/>
            <Switcher>
                Don't have an account? <Link to="/create-account">Create one &rarr;</Link>
            </Switcher>
        </Wrapper>
    )
}