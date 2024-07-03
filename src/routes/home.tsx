import PostTweetForm from "../components/post-tweet-form";
import {styled} from "styled-components"
import Timeline from "../components/timeline";
const Header = styled.div`
    padding-top:30px;
`
const Wrapper  =styled.div`
   border-right:3px solid var(--color-yellow);
    border-left:3px solid var(--color-yellow);
    padding: 0px 50px;
    width: 90%;
    display: grid;
    gap:40px;
    overflow-y: auto;
`
export default function Home(){    
    return (
        <Wrapper>
            <Header>Home</Header>
            <PostTweetForm>
            </PostTweetForm>
            <Timeline></Timeline>
        </Wrapper>
    )
}