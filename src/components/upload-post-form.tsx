import { addDoc, collection, updateDoc } from "firebase/firestore";
import React, { useState, useRef, useEffect } from "react";
import { styled } from "styled-components";
import { db, auth, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Wrapper = styled.div`
  width: 100%;
  border-bottom: 1px solid var(--color-yellow);
`;

const Form = styled.form`
  padding: 10px 20px;
`;
const FormRow = styled.div``;
const FormCol = styled.div``;
const UserPhoto = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;

const TextArea = styled.textarea`
  padding: 0px 0px 10px 20px;
  border: none;
  font-size: 16px;
  color: rgb(0, 0, 0);
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: var(--color-yellow);
  }
  width: 100%;
  overflow: hidden; /* 스크롤바 숨김 */
`;

const AttachFileButton = styled.label`
  padding: 10px 10px;
  color: var(--color-yellow);
  text-align: end;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    color: var(--color-yellow);
  }
  svg {
    width: 20px;
    height: 20px;
  }
`;
const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  padding: 5px 10px;
  color: white;
  text-align: center;
  border-radius: 20px;
  border: none;
  background-color: var(--color-yellow);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;
const PreviewImage = styled.img`
  padding-left: 20px;
  max-width: 100%;
  max-height: 300px;
  margin-top: 10px;
`;
export default function UploadPostForm() {
  const user = auth.currentUser;
  const MAX_FILE_SIZE_MB = 5 * 1024 * 1024;
  const [isLoding, setLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState<File | null>(null); //파일이거나 null
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // 먼저 높이를 auto로 설정
      textarea.style.height = `${textarea.scrollHeight}px`; // scrollHeight에 따라 높이 조절
    }
  };

  useEffect(() => {
    adjustTextareaHeight(); // 컴포넌트가 마운트될 때 초기 높이 설정
  }, [tweet]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
    adjustTextareaHeight(); // 입력할 때마다 높이 조절
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("not modal - file change");
        /*
        input은 복수의 파일을 업로드하게 해준다. 
        그러기에 하나의 파일만 얻기위해서 길이가 1이고 파일이 존재할 떄 file의 값을 files[0]으로 바꾼다.
        */
    const { files } = e.target;
    if (files && files.length === 1) {
      if (files[0].size >= MAX_FILE_SIZE_MB) {
        alert("사진 크기가 너무 큽니다.");
      } else {
        setFile(files[0]);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(files[0]);
      }
    }
  };
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || isLoding || tweet === "") {
      return;
    } else if (tweet.length > 180) {
      return;
    }
    try {
      setLoading(true);
      //컬렉션, 경로에 doc을 만들지 설정하고 넣을 데이터를 보낸다.
      // tweets에  고유 아이디를 가지는 tweet들이 생성
      const doc = await addDoc(collection(db, "tweets"), {
        tweet,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
        userTag: "@" + user?.email?.split("@")[0],
        likes: 0,
      });
      //파일이 있는 경우 파일 업로드
      if (file) {
        //이미지가 저장될 경로 설정 - 이미지 이름을 tweet의 id로 설정 tweets-> user별로 폴더생성 / tweet id로 이미지 이름 지정
        const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(doc, {
          photo: url,
        });
        setFile(null);
        setImagePreview(null);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setTweet("");
    }
  };
   
  return (
    <Wrapper>
      <Form onSubmit={onSubmit}>
        <main
          style={{ display: "flex", paddingTop: "20px", marginBottom: "10px" }}
        >
          <FormCol>
            {user?.photoURL ? (
              <UserPhoto src={user.photoURL}></UserPhoto>
            ) : (
              <UserPhoto></UserPhoto>
            )}
          </FormCol>
          <FormCol style={{ flex: "1" }}>
            <FormRow>
              <TextArea
                ref={textareaRef}
                rows={1}
                required
                onChange={onChange}
                value={tweet}
                placeholder="What's happening?"
              />
              {imagePreview && (
                <PreviewImage className="not-modal" src={imagePreview} alt="Preview" />
              )}
            </FormRow>
            <FormRow
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <div>
                <AttachFileInput
                  onChange={onFileChange}
                  id="file"
                  type="file"
                  accept="image/*"
                />
                <AttachFileButton htmlFor="file">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </AttachFileButton>
                <AttachFileButton>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                    />
                  </svg>
                </AttachFileButton>
              </div>
              <SubmitBtn
                type="submit"
                value={isLoding ? "Posting..." : "Post"}
              />
            </FormRow>
          </FormCol>
        </main>
      </Form>
    </Wrapper>
  );
}
