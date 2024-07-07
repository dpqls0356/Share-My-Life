import UploadPostForm from "../components/upload-post/upload-post-form";
import { styled } from "styled-components";
import Timeline from "../components/timeline";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import { useState } from "react";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1.3fr;
`;
const Main = styled.div`
  border-left: 1px solid var(--color-yellow);
  border-right: 1px solid var(--color-yellow);
  width: 100%;
  display: flex;
  flex-direction: column;
`;
export default function Home() {
  const [modifyMode, setModifyMode] = useState(false);
  return (
    <Wrapper>
      <Main>
        <Header title="Home" />
        {
        modifyMode?
        null:
        <div>
          <UploadPostForm />
          <Timeline></Timeline>
        </div>
          }
      </Main>
      <Sidebar />
    </Wrapper>
  );
}
