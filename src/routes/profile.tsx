import { useEffect, useState } from "react";
import { auth, storage, db } from "../firebase";
import styled from "styled-components";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { IPost } from "../components/timeline";
import Post from "../components/post";
import Header from "../components/layout/header";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: black;
  color: white;
  cursor: pointer;
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.p`
  font-size: 22px;
`;
const Posts = styled.div``;

const UserProfile = styled.div`
  width: 100%;
`;

const UserInfo = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  .user-image {
    position: absolute;
    top: -75px;
    left: 3%;
    width: 150px;
    height: 150px;
    & > * {
      border: 5px solid white;
      border-radius: 50%;
      background-color: black;
      color: white;
    }
  }
  .userinfo-row {
    height: fit-content;
    width: 100%;
    padding-left: 5%;
  }
  //첫번째 row - 프로필 수정 버튼
  .userinfo-row:nth-child(2) {
    display: flex;
    justify-content: flex-end;
    font-size: 20px;
    font-weight: 800;
    padding: 20px 0px;
    & > div {
      padding: 10px 20px;
      border-radius: 20px;
      border: 2px solid var(--color-brown);
      margin-right: 20px;
    }
    & > div:hover {
      background-color: #c99ca4;
    }
  }
  //두번째 row - 프로필 이름 부분
  .userinfo-row:nth-child(3) {
    margin-bottom: 20px;
    & > div:nth-child(1) {
      font-size: 25px;
      font-weight: 700;
      margin-bottom: 7px;
      color: var(--color-brown);
    }
    & > div:nth-child(2) {
      font-size: 15px;
      font-weight: 700;
      color: #c99ca4;
      margin-bottom: 5px;
    }
  }
  //세번째 row -  자기소개 부분
  .userinfo-row:nth-child(4) {
    width: 96%;
    padding-top: 20px;
    padding-bottom: 20px;
    border-top: 1px solid var(--color-brown);
    border-bottom: 1px solid var(--color-brown);
    font-weight: 600;
  }
`;

const BackGroundImg = styled.div`
  width: 100%;
  min-height: 250px;
  height: 30vh;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
  }
`;
const PostList = styled.div`
  width: 96%;
`;
const PostListNav = styled.div<{ marginLeftValue: string }>`
  display: flex;
  position: relative;
  padding: 25px 0px;
  border-bottom: 1px solid var(--color-brown);
  & > div {
    font-weight: 600;
    display: flex;
    justify-content: center;
    width: 33%;
  }
  & > p {
    width: 33%;
    height: 5px;
    background-color: #c99ca4;
    position: absolute;
    bottom: -2.5px;
    margin-left: ${(props) => props.marginLeftValue};
  }
`;

interface IUserInfo {
  backgroundImg?: string;
  userId?: string;
  introduce?: string;
}

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [userInfo, setUserInfo] = useState<IUserInfo | null>(null);
  const [postType, setPostType] = useState<String>("My Posts");
  const marginLeftValue =
    postType === "My Posts" ? "0%" : postType === "Likes" ? "33%" : "66%";
  //이미지 변경
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
      setAvatar(avatarUrl);
    }
  };
  //글 가져오기
  const fetchPosts = async () => {
    //firebase가 예상치 못한 필터이기에 알려야한다. -> 인덱스 설정하러가기
    const postQuery = query(
      collection(db, "posts"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );
    const snapshot = await getDocs(postQuery);
    const postsInDB = snapshot.docs.map((doc) => {
      const {
        post,
        createdAt,
        userId,
        username,
        photo,
        userTag,
        likes,
        userphoto,
      } = doc.data();
      return {
        post,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id, //doc의 id는 data에 포함되지않기에 따로 빼와야한다.
        userTag,
        likes,
        userphoto,
      };
    });
    setPosts(postsInDB);
  };
  //배경 바꾸기
  const onBackgroundImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { files } = e.target;
    if (files && files?.length === 1) {
      const file = files[0];
      //동일한 위치에 업로드하면 기존의 이미지를 덮어쓰는 형식이다.
      const locationRef = ref(storage, `backgroundImages/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const backgroudImgUrl = await getDownloadURL(result.ref);
      saveBackgroundImg(backgroudImgUrl);
    }
  };
  const saveBackgroundImg = async (downloadURL: string) => {
    if (!user?.uid) return;
    const userDocRef = doc(db, "users", user.uid); // 'users' 컬렉션의 특정 문서 참조를 생성
    await setDoc(
      userDocRef,
      {
        backgroundImg: downloadURL,
      },
      { merge: true }
    ); // 데이터를 병합하여 저장
  };
  //유저 정보 가져오기
  const fetchUserInfo = async () => {
    if (!user?.uid) return null; // 사용자 인증 상태 확인

    const userDocRef = doc(db, "users", user.uid); // Firestore의 'users' 컬렉션 내 특정 사용자 문서 참조
    const userDocSnap = await getDoc(userDocRef); // 해당 문서 스냅샷 가져오기

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data(); // 문서 데이터 추출
      return userData; // backgroundImg 필드 반환
    } else {
      console.log("No such document"); // 문서가 없을 경우
      return null;
    }
  };
  //수정 모달 띄우기
  const openModifyProfileModal = () => {};
  useEffect(() => {
    fetchPosts();
    const loadUserInfo = async () => {
      const userInfo = await fetchUserInfo();
      console.log(userInfo);
      setUserInfo(userInfo);
    };

    loadUserInfo();
  }, [user]);
  return (
    <Wrapper>
      <Header title="Profile" />
      <UserProfile>
        <BackGroundImg>
          <img src={userInfo?.backgroundImg} alt="" />
        </BackGroundImg>
        <UserInfo>
          <div className="user-image">
            {Boolean(avatar) ? (
              <AvatarImg src={avatar || ""} />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div className="userinfo-row">
            <div onClick={openModifyProfileModal}>Update Profile</div>
          </div>
          <div className="userinfo-row">
            <div>{user?.displayName ?? "Anoymous"}</div>
            <div>@{user?.email?.split("@")[0]}</div>
          </div>
          <div className="userinfo-row">{userInfo?.introduce}</div>
        </UserInfo>
      </UserProfile>
      <PostList>
        <PostListNav marginLeftValue={marginLeftValue}>
          <div
            onClick={() => {
              setPostType("My Posts");
            }}
          >
            My Posts
          </div>
          <div
            onClick={() => {
              setPostType("Likes");
            }}
          >
            Likes
          </div>
          <div
            onClick={() => {
              setPostType("Comment");
            }}
          >
            Comment
          </div>
          <p></p>
        </PostListNav>
        <Posts>
          {posts.map((post) => (
            <Post key={post.id} {...post} />
          ))}
        </Posts>
      </PostList>
    </Wrapper>
  );
}

// <AvatarUpload htmlFor="avatar">
//   {Boolean(avatar) ? (
//     <AvatarImg src={avatar || ""} />
//   ) : (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="currentColor"
//       className="size-6"
//     >
//       <path
//         fillRule="evenodd"
//         d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
//         clipRule="evenodd"
//       />
//     </svg>
//   )}
// </AvatarUpload>
// <AvatarInput
//   onChange={onAvatarChange}
//   id="avatar"
//   type="file"
//   accept="image/*"
// />
