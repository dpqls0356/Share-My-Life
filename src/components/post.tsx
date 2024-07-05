import { deleteDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { ITweet } from "./timeline";
import styled from "styled-components";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
  border-bottom: 1px solid var(--color-yellow);
  height: max-content;
  padding: 30px 20px;
  display: flex;
`;
const PostCol = styled.div`
  .user-photo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
`;
const PostRow = styled.div`
  .post-text {
  }
  .post-photo {
    overflow: hidden;
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
  display: flex;
  svg {
    width: 17px;
    height: 17px;
  }
`;

export default function Tweet({
  username,
  photo,
  tweet,
  userId,
  id,
  userTag,
  likes,
  createdAt,
}: ITweet) {
  const user = auth.currentUser;
  const date = new Date(createdAt);

  // 년, 월, 일로 포맷팅
  const year = date.getFullYear();
  const month = ("" + (date.getMonth() + 1)).slice(-2); // 0 기반 월을 1부터 시작하게 하고 두 자리 숫자로 변환
  const day = ("" + date.getDate()).slice(-2); // 두 자리 숫자로 변환
  const onDelete = async () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      //사진이 있는 경우 삭제 -> 사용자id와 일치하는 곳 중에 tweet id가 일치하면된다.
      if (photo) {
        const photoRef = ref(storage, `tweet/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };
  return (
    <Wrapper>
      <PostCol>
        {user?.photoURL ? (
          <img className="user-photo" src={user?.photoURL} />
        ) : (
          <svg
            className="user-photo"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
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
            <div>
              <svg
                style={{ width: "20px", height: "20px", marginLeft: "20px" }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
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
          <div className="post-text">{tweet}</div>
          {photo ? (
            <div className="post-photo">
              <img src={photo}></img>
            </div>
          ) : null}
        </PostRow>
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
              class="size-6"
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
              class="size-6"
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
              class="size-6"
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
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
              />
            </svg>
          </PostIcon>
        </PostRow>
      </PostCol>
    </Wrapper>
  );
}
