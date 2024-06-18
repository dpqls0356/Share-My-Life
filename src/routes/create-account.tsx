import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useState } from "react"
import {styled} from "styled-components"
import {auth} from "../firebase.tsx";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
const Wrapper = styled.div`
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    padding:50px 0px;
    width:100%;

`
const Form = styled.form`
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 30%;
`
const Input = styled.input`
        padding:10px 20px;
        border-radius: 50px;
        border: none;
        width: 100%;
        font-size: 16px;
        &[type="submit"]{
            cursor:pointer;
            background-color: #009dff;
            color:white;
            &:hover{
                background-color: #0178c2;
            }
        }
`
const Title = styled.h1`
    font-size: 42px;
`
const Error = styled.span`
    font-weight: 900;
    color: red;
`
export default function CreateAccount(){
    const [loading,setLoading] = useState(false);
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setErorr] = useState("");
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
        //중요 : 계정 생성에 들어갔음을 판단하기 위함
        setLoading(true);
        // 사용자가 정보를 전부 입력하지않은 경우와 이미 계정을 생성하고 있을 때 다시 요청을 보내는 것을 막음
        if(loading||name===""||email===""||password==="")return;
        try{
            //계정생성하기
            const credentials =  await createUserWithEmailAndPassword(auth,email,password);
            console.log(credentials.user);
            //사용자 이름 업데이트
            await updateProfile(credentials.user,{
                displayName:name,
            })
            //리다이렉션
            navigate("/");
        }catch(e){
            // setErorr();
        }finally{
            //중요 : 과정을 다 거친 경우 false로 변경
            setLoading(false);
        }
    }
    return(
        <Wrapper>
            <Title>Join Twitter</Title>
            <Form onSubmit={onSumbit}>
                <Input onChange={onChange} value={name} name="name"  placeholder="Name" type="text" required/>
                <Input onChange={onChange} value={email} name="email" placeholder="Email" type="email" required/>
                <Input onChange={onChange} value={password} name="password" placeholder="Password" type="password" required/>
                <Input type="submit" value={loading?"Loading...":"Create account"}/>
            </Form>
            {error!==""?<Error>{error}</Error>:null}
        </Wrapper>
    )
}