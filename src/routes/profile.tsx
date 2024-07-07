import { useEffect, useState } from "react";
import { auth, storage, db } from "../firebase";
import styled from "styled-components";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDoc,
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
  gap: 20px;
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
export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [posts, setPosts] = useState<IPost[]>([]);
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
      const { post, createdAt, userId, username, photo, userTag, likes,userphoto } = doc.data();
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
  useEffect(() => {
    fetchPosts();
  });
  return (
    <Wrapper>
       <Header title="Profile" />
      <AvatarUpload htmlFor="avatar">
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
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Name>{user?.displayName ?? "Anoymous"}</Name>
      <Posts>
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </Posts>
    </Wrapper>
  );
}
