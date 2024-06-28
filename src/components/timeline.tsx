import { collection,query ,orderBy, getDocs} from "firebase/firestore";
import { useEffect, useState } from "react";
import {styled} from "styled-components"
import { db } from "../firebase";
import Tweet from "./tweet";
export interface ITweet{
    id:string;
    photo?:string,  //필수가 아닐때 ?를 붙이기
    tweet:string;
    userId:string;
    username:string;
    createdAt:number;
}
const Wrapper = styled.div`
    
`
export default function Timeline(){
    const [tweets,setTweet] = useState<ITweet[]>([]);
    const fetchTweets = async()=>{
        //쿼리 생성
        const tweetsQuery = query(
            //tweets 컬렉션에서 생성일이 가장 빠른 순으로 데이터를 가져오는 것
            collection(db,"tweets"),
            orderBy("createdAt","desc")
        );
        const snapshot = await getDocs(tweetsQuery);
        const TweetsInDB = snapshot.docs.map((doc)=>{
            const {tweet,createdAt,userId,username,photo} = doc.data(); //doc의 data를 가져오는것
            return {
                tweet,createdAt,userId,username,photo,
                id:doc.id   //doc의 id는 data에 포함되지않기에 따로 빼와야한다.
            }
        });
        setTweet(TweetsInDB);
    }
    useEffect(()=>{
        fetchTweets();
    },[])
    return <Wrapper>
        {tweets.map((tweet)=>{
            return <Tweet key={tweet.id}{...tweet}/>
        })}
    </Wrapper>
}