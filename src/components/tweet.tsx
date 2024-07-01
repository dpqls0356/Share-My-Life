import { deleteDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { ITweet } from "./timeline";
import styled from "styled-components";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding :20px;
    border: 1.5px solid #1d9bf0;
    border-radius:15px;
    margin-bottom: 10px;
`
const Column = styled.div`
    
`
const Username = styled.span`
    font-weight: 600;
    font-size: 15px;
`
const Payload = styled.p`
    margin: 10px 0px;
    font-size: 18px;
`
const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius:15px;
`

const DeleteButton = styled.button`
    background-color: tomato;
    color:white;
    font-weight: 600;
    border: none;
    padding:5px 10px;
    font-size: 12px;
    text-transform: uppercase;
    border-radius: 5px;

`

export default function Tweet({username,photo,tweet,userId,id}:ITweet){
    const user = auth.currentUser;
    const onDelete = async()=>{
        const ok = confirm("Are you sure you want to delete this tweet?");
        if(!ok||user?.uid!==userId)return;
        try{
            await deleteDoc(doc(db,"tweets",id));
            //사진이 있는 경우 삭제 -> 사용자id와 일치하는 곳 중에 tweet id가 일치하면된다.
            if(photo){
                const photoRef = ref(storage,`tweet/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        }catch(e){
            console.log(e);
        }
        finally{

        }
    }
    return <Wrapper>
        <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {
            user?.uid===userId?<DeleteButton onClick={onDelete}>Delete</DeleteButton>:null
        }
        </Column>
        {
            photo?<Photo src={photo}></Photo>:null
        }
        
    </Wrapper>
}