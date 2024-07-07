import {
  collection,
  query,
  orderBy,
  getDocs,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Post from "./post";
import { Unsubscribe } from "firebase/auth";
export interface IPost {
  id: string;
  photo?: string; //필수가 아닐때 ?를 붙이기
  post: string;
  userId: string;
  username: string;
  createdAt: number;
  userTag: string;
  likes: number;
}
const Wrapper = styled.div`
flex: 1;
  .notify-no-data{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .notify-no-data > div:nth-child(1){
    svg{
      width: 50px;
      height: 50px;
    }
  }
    .notify-no-data > div:nth-child(2){
    p{
      text-align: center;
      font-size: 20px;
    }
  }
`;
//현재 페이지에 대한 정보를 받아 알맞는 쿼리를 보내 데이터 가져오기
//홈 -> 최신글 , 프로필 -> 내가 쓴 글 이런식으로 ???
export default function Timeline() {
  const [posts, setPost] = useState<IPost[]>([]);
  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    const fetchPosts = async () => {
      //쿼리 생성
      const postsQuery = query(
        //posts 컬렉션에서 생성일이 가장 빠른 순으로 데이터를 가져오는 것
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      //한번만 불러오기
      // const snapshot = await getDocs(postsQuery);
      // const PostsInDB = snapshot.docs.map((doc)=>{
      //     const {post,createdAt,userId,username,photo} = doc.data(); //doc의 data를 가져오는것
      //     return {
      //         post,createdAt,userId,username,photo,
      //         id:doc.id   //doc의 id는 data에 포함되지않기에 따로 빼와야한다.
      //     }
      // });
      // setPost(PostsInDB);

      // db 및 쿼리와 실시간 연결을 생성하고 쿠리에 새 요소가 생성되거나 삭제, 업데이트 되었을 때 쿼리
      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        //snapshot은 크기, 쿼리, 문서등의 변경사항을 볼 수 있다.
        const PostsInDB = snapshot.docs.map((doc) => {
          const { post, createdAt, userId, username, photo, userTag, likes } =
            doc.data(); //doc의 data를 가져오는것
          return {
            post,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id, //doc의 id는 data에 포함되지않기에 따로 빼와야한다.
            userTag,
            likes,
          };
        });
        setPost(PostsInDB);
      });
    };
    fetchPosts();
    // unscubscribe은 onSnapshot 결과 값을 가지면 true가 되고
    // 그럴 경우 언마운트 될 때 unsubscribe()가 실행되어 구독취소가 된다.
    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {
        posts.length==0?
        <div className="notify-no-data">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
            </svg>
          </div>
          <div>
            <p>
              There is no posting.
            </p>
            <p>
              Try doing your first post!
            </p>
          </div>
          </div>
        :posts.map((post) => {
        return <Post key={post.id} {...post} />;})
        
      }
    </Wrapper>
  );
}
