import PostTweetForm from "../components/post-tweet-form";
import {styled} from "styled-components"
import Timeline from "../components/timeline";
const Wrapper  =styled.div`
    width: 90%;
    display: grid;
    gap: 50px;
    overflow-y: scroll;
    grid-template-rows: 1fr 5fr;
`
export default function Home(){    
    return (
        <Wrapper>
            <PostTweetForm>
            </PostTweetForm>
            <Timeline></Timeline>
        </Wrapper>
    )
}