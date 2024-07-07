import { deleteDoc, doc,addDoc, collection, updateDoc  } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { IPost } from "./timeline";
import styled from "styled-components";
import { deleteObject, ref, getDownloadURL, uploadBytes  } from "firebase/storage";
import React, { useState, useRef, useEffect } from "react";

const Wrapper = styled.div`
  border-bottom: 1px solid var(--color-yellow);
  height: max-content;
  padding: 30px 20px;
  display: flex;
`;

const PostCol = styled.div`
  .user-photo {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
`;
const PostRow = styled.div`
  .post-text {
  }
  .post-photo {
    margin-top: 10px;
    // max크기보다 작은 사진들을 위한 fit-content
    width:fit-content;
    height: fit-content;
    // max크기를 지정해 일정 크기보다 넘지 않도록 함
    max-width:500px;
    max-height: 300px;
    // 넘치는 부분들은 숨김
    overflow: hidden;
    border-radius: 20px;
    img{
      border-radius: 20px;
      width: 100%;
      height: 100%;
    }
  }
  .setting{
    position: relative;
  }
  .setting-block{
    position: absolute;
    left: 0;
  }
`;
const UserName = styled.div`
  font-weight: 900;
  margin-right: 20px;
  font-size: 17px;
`;
const UserTag = styled.div`
  font-weight: 500;
  font-size: 14px;
`;
const PostIcon = styled.div`
margin-top: 10px;
  display: flex;
  svg {
    width: 17px;
    height: 17px;
  }
`;
const PostingSetting = styled.div`
  background-color: white;
  border: 1px solid black;
`
const Btn = styled.div`
    padding: 5px 20px 5px 3px;
`
//
const Form = styled.form`
`;
const FormRow = styled.div``;
const FormCol = styled.div``;
const UserPhoto = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;

const TextArea = styled.textarea`
  /* padding: 0px 0px 10px 20px; */
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


export default function Post(postInfo: IPost) {
  const {
  username,
    photo,
    userId,
    id,
    userTag,
    likes,
    createdAt,
  } = postInfo;
  const user = auth.currentUser;
  const date = new Date(createdAt);
  // 년, 월, 일로 포맷팅
  const year = date.getFullYear();
  const month = ("" + (date.getMonth() + 1)).slice(-2); // 0 기반 월을 1부터 시작하게 하고 두 자리 숫자로 변환
  const day = ("" + date.getDate()).slice(-2); // 두 자리 숫자로 변환
  const [post,setPost]= useState(postInfo.post);
  const [isHidden,setIsHidden] = useState(true);
  const [modifyMode,setModifyMode] = useState(false);
  const controllSettingBlock =()=>{
    setIsHidden(current=>!current);
  }
  const controllerModifyMode = ()=>{
    setModifyMode(current=>!current);
    setIsHidden(true);
  }
   const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
        if (!ok || user?.uid !== userId) return;
        try {
        await deleteDoc(doc(db, "posts", id));
        //사진이 있는 경우 삭제 -> 사용자id와 일치하는 곳 중에 tweet id가 일치하면된다.
        if (photo) {
            const photoRef = ref(storage, `tweet/${user.uid}/${id}`);
            await deleteObject(photoRef);
        }
        } catch (e) {
        console.log(e);
        } finally {
          setIsHidden(true);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
  const MAX_FILE_SIZE_MB = 5 * 1024 * 1024;
  const [isLoding, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null); //파일이거나 null
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(photo?photo:null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // 먼저 높이를 auto로 설정
      textarea.style.height = `${textarea.scrollHeight}px`; // scrollHeight에 따라 높이 조절
    }
  };

  useEffect(() => {
    adjustTextareaHeight(); // 컴포넌트가 마운트될 때 초기 높이 설정
  }, [post]);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(e.target.value);
    adjustTextareaHeight(); // 입력할 때마다 높이 조절
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const onModify = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("modify")
    e.preventDefault();
    if (!user || isLoding || post === "") {
      return;
    } else if (post.length > 180) {
      return;
    }
    try {
      setLoading(true);
      await updateDoc(doc(db, 'posts', id), {
        post
      });
      //파일이 있는 경우 파일 업로드
      if (file) {
        const documentRef = doc(db, 'posts', id);
        //이미지가 저장될 경로 설정 - 이미지 이름을 tweet의 id로 설정 tweets-> user별로 폴더생성 / tweet id로 이미지 이름 지정
        const locationRef = ref(storage, `posts/${user.uid}/${id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(documentRef, {
          photo: url,
        });
      }
    } 
    catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setModifyMode(false);
      
    }
  };
  return (
    <Wrapper>
      <PostCol>
        {user?.photoURL ? (
          <img className="user-photo" src={user?.photoURL} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6 user-photo"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        )}
      </PostCol>
      <PostCol style={{ marginLeft: "10px", flex: "1" }}>
        <PostRow
          style={{
            display: "flex",
            alignContent: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <UserName>{username}</UserName>
            <div
              style={{
                fontWeight: "500",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div>{userTag}</div>
              <div style={{ margin: "0px 5px" }}>·</div>
              <div>{year + "년 " + month + "월 " + day + "일"}</div>
            </div>
          </div>
          {user?.uid === userId ? (
            <div className="setting">
              <div onClick={controllSettingBlock}>
                <svg
                  style={{ width: "20px", height: "20px",}}
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
                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </div>
            <div className="setting-block">
              {isHidden?
              null:
              <PostingSetting>
                <Btn style={{borderBottom:"1px solid black"}} onClick={onDelete}>Delete</Btn>
                <Btn onClick={controllerModifyMode} className="modify-btn">{modifyMode?"Cancel":"Modify"}</Btn>
              </PostingSetting>
               }
            </div>
            </div>
          ) : null}
        </PostRow>
        <PostRow
          style={{
            marginTop: "10px",
            marginBottom: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            fontSize: "18px",
          }}
        >
          {
            modifyMode?
            <div>
              <Form>
                <FormCol style={{ flex: "1" }}>
                  <FormRow>
                    <TextArea
                      ref={textareaRef}
                      rows={1}
                      required
                      onChange={onChange}
                      value={post}
                      placeholder="What's happening?"
                    />
                    {imagePreview && (
                      <PreviewImage src={imagePreview} alt="Preview" />
                    )}
                  </FormRow>
                </FormCol>
      </Form>
            </div>
            :
            <div>
              <div className="post-text">{post}</div>
              {photo ? (
                <div className="post-photo">
                  <img src={photo}></img>
                </div>
              ) : null}
            </div>
          }
        </PostRow>
        {modifyMode?
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
                        id={id}
                        type="file"
                        accept="image/*"
                      />
                      <AttachFileButton htmlFor={id}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="size-6 no-paading-left"
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
                onClick={onModify}
                type="submit"
                value={isLoding ? "Modifying..." : "Modify"}
              />
          </FormRow>:
          <PostRow
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <PostIcon>
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
                  d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                />
              </svg>
            </PostIcon>
            <PostIcon>
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
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
              <p>{likes}</p>
            </PostIcon>
            <PostIcon>
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
                  d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3"
                />
              </svg>
            </PostIcon>
            <PostIcon>
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
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            </PostIcon>
          </PostRow>
      }
      </PostCol>
    </Wrapper>
  );
}
