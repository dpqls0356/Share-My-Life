import { createUserWithEmailAndPassword, updateProfile,sendEmailVerification } from "firebase/auth"
import { useState, useEffect} from "react"
import {auth} from "../firebase.tsx";
import { useNavigate ,Link} from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {Wrapper,Title,Form,Input,Switcher,Error} from "../components/auth-components.ts"
import GithubButton from "../components/github-btn.tsx";

export default function CreateAccount(){
    const [loading,setLoading] = useState(false);
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();
    const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {
            target:{name,value},
        }=e;
        if(name==="name"){
            setName(value);
        }else if(name==="password"){
            setPassword(value);
        }
        else if(name==="email"){
            setEmail(value);
        }
    }
    const onSumbit = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError("");
        //중요 : 계정 생성에 들어갔음을 판단하기 위함
        // 사용자가 정보를 전부 입력하지않은 경우와 이미 계정을 생성하고 있을 때 다시 요청을 보내는 것을 막음
        if(loading||name===""||email===""||password==="")return;
        try{
            setLoading(true);
            //계정생성하기
            const credentials =  await createUserWithEmailAndPassword(auth,email,password);
            // await sendEmailVerification(credentials.user);
            //사용자 이름 업데이트
            await updateProfile(credentials.user,{
                displayName:name,
            })
            //리다이렉션
            navigate("/");
        }catch(e){
            if (e instanceof FirebaseError) {
                // Firebase 에러 코드에 따른 메시지 설정
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
        "auth/email-already-in-use": "해당 이메일은 이미 사용 중입니다.",
        "auth/weak-password": "취약한 비밀번호입니다. 길이를 더 길게 하거나 소문자, 특수문자, 숫자를 함께 사용하여 설정하세요.",
        "auth/invalid-email": "유효하지 않은 이메일입니다.",
    }
    // useEffect(()=>{
    //     const user = auth.currentUser;
    //     if(user!==null){
    //         navigate("/");
    //     }
    // },[])
    return(
        <Wrapper>
            <Title>Join</Title>
            {error!==""?<Error>{error}</Error>:null}
            <Form onSubmit={onSumbit}>
                <Input onChange={onChange} value={name} name="name"  placeholder="Name" type="text" required/>
                <Input onChange={onChange} value={email} name="email" placeholder="Email" type="email" required/>
                <Input onChange={onChange} value={password} name="password" placeholder="Password" type="password" required/>
                <Input type="submit" value={loading?"Loading...":"Create account"}/>
            </Form>
            <GithubButton/> 
            <Switcher>
                Already have an account? <Link to="/login">Log in &rarr;</Link>
            </Switcher>
        </Wrapper>
    )
}