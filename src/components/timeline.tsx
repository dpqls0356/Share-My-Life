import { collection,query ,orderBy, getDocs, onSnapshot,limit} from "firebase/firestore";
import { useEffect, useState } from "react";
import {styled} from "styled-components"
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";
export interface ITweet{
    id:string;
    photo?:string,  //필수가 아닐때 ?를 붙이기
    tweet:string;
    userId:string;
    username:string;
    createdAt:number;
}
const Wrapper = styled.div`
 
    display: flex;
    grid-template-columns: 10px;
    flex-direction: column;
    overflow-y: auto;

`
export default function Timeline(){
    const [tweets,setTweet] = useState<ITweet[]>([]);
    useEffect(()=>{
        let unsubscribe : Unsubscribe | null = null;
        const fetchTweets = async()=>{
        //쿼리 생성
        const tweetsQuery = query(
            //tweets 컬렉션에서 생성일이 가장 빠른 순으로 데이터를 가져오는 것
            collection(db,"tweets"),
            orderBy("createdAt","desc"),
            limit(25)
        );
        //한번만 불러오기
        // const snapshot = await getDocs(tweetsQuery);
        // const TweetsInDB = snapshot.docs.map((doc)=>{
        //     const {tweet,createdAt,userId,username,photo} = doc.data(); //doc의 data를 가져오는것
        //     return {
        //         tweet,createdAt,userId,username,photo,
        //         id:doc.id   //doc의 id는 data에 포함되지않기에 따로 빼와야한다.
        //     }
        // });
        // setTweet(TweetsInDB);

        // db 및 쿼리와 실시간 연결을 생성하고 쿠리에 새 요소가 생성되거나 삭제, 업데이트 되었을 때 쿼리
        unsubscribe = await onSnapshot(tweetsQuery,(snapshot)=>{
            //snapshot은 크기, 쿼리, 문서등의 변경사항을 볼 수 있다.
            const TweetsInDB = snapshot.docs.map((doc)=>{
                const {tweet,createdAt,userId,username,photo} = doc.data(); //doc의 data를 가져오는것
                return {
                    tweet,createdAt,userId,username,photo,
                    id:doc.id   //doc의 id는 data에 포함되지않기에 따로 빼와야한다.
                };
           })
            setTweet(TweetsInDB);
            console.log(tweets);
        });
        }
    fetchTweets();
        // unscubscribe은 onSnapshot 결과 값을 가지면 true가 되고
    // 그럴 경우 언마운트 될 때 unsubscribe()가 실행되어 구독취소가 된다.
    return()=>{
        unsubscribe && unsubscribe();
    }
    },[])
    return <Wrapper>
        {tweets.map((tweet)=>{
            return <Tweet key={tweet.id}{...tweet}/>
        })}
    </Wrapper>
}