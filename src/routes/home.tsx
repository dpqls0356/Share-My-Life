import UploadPostForm from "../components/upload-post/upload-post-form";
import { styled } from "styled-components";
import Timeline from "../components/timeline";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
import { useState } from "react";

const Wrapper = styled.div``;
export default function Home() {
  const [modifyMode, setModifyMode] = useState(false);
  return (
    <Wrapper>
      <Header title="Home" />
      {modifyMode ? null : (
        <div className="main">
          <UploadPostForm />
          <Timeline></Timeline>
        </div>
      )}
    </Wrapper>
  );
}
