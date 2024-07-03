import { styled } from "styled-components";

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;
 
export const Title = styled.h1`
  font-size: 42px;
`;

export const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const Input = styled.input`
  padding: 13px 20px;
  width: 100%;
  font-size: 16px;
  border:none;
  border-bottom:1px solid var(--color-dark_gray);
  &:focus{
  outline:none;
  }
  &[type="submit"] {
  margin:20px 0px 10px 0px;
    background-color:var(--color-yellow);
    color:black;
    cursor: pointer;
    &:hover {
      background-color:#ffdc2d;
    }
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  color:black;
  a {
    color: #e5bb02;
  }
`;
export const Divide=styled.div`
  margin:10px 0px;
  display:flex;
  justify-content:center;
  align-items:center;
  width:100%;
`
export const Line = styled.div`
  width:45%;
  height:0.5px;
  background-color:var(--color-dark_gray);
`
export const Text =styled.p`
  margin:0px 5px;
  color :var(--color-dark_gray);
`