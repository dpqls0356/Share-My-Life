import { addDoc, collection, updateDoc } from "firebase/firestore"
import React, { useState } from "react"
import {styled} from "styled-components"
import {db,auth, storage} from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
const Form = styled.form`
    width:100%;
    display: flex;
    flex-direction: column;
    gap:10px
`
const TextArea = styled.textarea`
    border:  2px solid #1d9bf0;
    padding:20px;
    border-radius: 20px;
    font-size: 16px;
    background-color: white;
    color: black;
    resize: none;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    &::placeholder{
        font-size: 16px;
    }
    &:focus{
        outline: none;
        border-color: #77c6ff;
    }
`

const AttachFileButton = styled.label`
    padding:10px 10px;
    color:#1d9bf0;
    text-align:end;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    &:hover{
        color:#0f6096;
    }
`
const AttachFileInput = styled.input`
    display: none;
`

const SubmitBtn = styled.input`
     padding:10px 0px;
    color:white;
    text-align: center;
    border-radius: 20px;
   border: none;
    background-color: #1d9bf0;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`
export default function PostTweetForm(){
    const MAX_FILE_SIZE_MB = 5 * 1024 * 1024;
    const [isLoding,setLoading] = useState(false);
    const [tweet,setTweet] = useState("");
    const [file,setFile] = useState<File|null>(null); //파일이거나 null
    const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setTweet(e.target.value);
    }
    const onFileChange= (e:React.ChangeEvent<HTMLInputElement>)=>{
        /*
        input은 복수의 파일을 업로드하게 해준다. 
        그러기에 하나의 파일만 얻기위해서 길이가 1이고 파일이 존재할 떄 file의 값을 files[0]으로 바꾼다.
        */
        const {files} = e.target;
        if(files&&files.length===1){
            if(files[0].size>=MAX_FILE_SIZE_MB){
                alert("사진 크기가 너무 큽니다.");
            }
            else{
                setFile(files[0]);
            }
        }
    }
    const onSubmit = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const user = auth.currentUser;
        if(!user||isLoding||tweet===""){
            return ;
        }
        else if(tweet.length>180){
            return;
        }
        try{
            setLoading(true);
            //컬렉션, 경로에 doc을 만들지 설정하고 넣을 데이터를 보낸다.
            // tweets에  고유 아이디를 가지는 tweet들이 생성
            const doc = await addDoc(collection(db,"tweets"),{
                tweet,
                createdAt : Date.now(),
                username : user.displayName||"Anonymous",
                userId:user.uid,
            })
            //파일이 있는 경우 파일 업로드
            if(file){
                //이미지가 저장될 경로 설정 - 이미지 이름을 tweet의 id로 설정 tweets-> user별로 폴더생성 / tweet id로 이미지 이름 지정
                const locationRef = ref(storage,`tweets/${user.uid}-${user.displayName}/${doc.id}`);
                const result = await uploadBytes(locationRef,file);
                const url = await getDownloadURL(result.ref);
                await updateDoc(doc,{
                    photo:url
                })
                setTweet("");
                setFile(null);
            }   

        }catch(e){
            
            console.log(e);

        }finally{
            
            setLoading(false);
        
        }
    }

    return (
        <Form onSubmit={onSubmit}> 
            <AttachFileButton htmlFor="file">{file?"File added✓":"Add Photo"}</AttachFileButton>
            <AttachFileInput onChange={onFileChange} id="file" type="file" accept="image/*" />
            <TextArea required rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="What is happening!?"/>
            <SubmitBtn type='submit' value={isLoding?'Posting...':'Post Tweet'}/>
        </Form>
    )
}