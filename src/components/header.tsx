import {styled} from "styled-components"
const Title = styled.div`
    padding:20px;
    border-bottom: 1px solid var(--color-yellow);
    font-weight: 700;
`
export default function Header({title}){
    return <>
        <Title>{title}</Title>
    </>
}