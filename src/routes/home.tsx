import PostTweetForm from "../components/post-tweet-form";
import {styled} from "styled-components"
import Timeline from "../components/timeline";
import Header from "../components/header";

const Wrapper  =styled.div`
    border-left:1px solid var(--color-yellow);
    border-right:1px solid var(--color-yellow);
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
`
export default function Home(){    
    return (
        <Wrapper>
            <Header title="Home"/>
            <Timeline></Timeline>
        </Wrapper>
    )
}