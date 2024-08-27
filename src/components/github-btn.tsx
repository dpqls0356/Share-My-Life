import { styled } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, storage, db } from "../firebase"; // storage와 db 추가
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage"; // 추가
import { doc, getDoc, setDoc } from "firebase/firestore"; // 추가

const Button = styled.button`
  margin-top: 10px;
  font-size: 16px;
  width: 100%;
  background-color: var(--color-gray);
  border: none;
  color: black;
  cursor: pointer;
  &:hover {
    background-color: #e0dede;
  }
  gap: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 13px 20px;
`;

export default function GithubButton() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onClick = async () => {
    setError("");
    try {
      const provider = new GithubAuthProvider();

      // 팝업창을 통한 로그인
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      console.log(user);

      // 해당 사용자가 처음 로그인한 것인지 확인
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // 사용자가 처음 로그인한 경우
        // 기본 배경 이미지 URL을 가져와 Firestore에 저장
        const fileRef = ref(
          storage,
          "backgroundImages/default_background_img.jpg"
        ); // 파일 경로 지정
        const downloadURL = await getDownloadURL(fileRef);

        await setDoc(
          userDocRef,
          {
            introduce: "",
            backgroundImg: downloadURL,
            userId: user.uid, // 여기에 userId 필드를 설정합니다.
          },
          { merge: true }
        ); // 데이터를 병합하여 저장
      }

      // 로그인 성공 후 리다이렉트
      navigate("/");
    } catch (e) {
      if (e instanceof FirebaseError) {
        // Firebase 에러 코드에 따른 메시지 설정
        setError("login error");
        console.log(e);
      }
    }
  };

  return (
    <Button onClick={onClick}>
      <FontAwesomeIcon icon={faGithub} />
      Continue With Github
    </Button>
  );
}
