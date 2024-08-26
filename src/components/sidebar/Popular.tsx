import styled from "styled-components";

const Warraper = styled.div`
  margin-top: 20px;
  padding: 20px 20px 0px 20px;
  background-color: #dbdbdbc5;
  border-radius: 20px;
  min-height: 50vh;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 700;
  svg {
    width: 18px;
    height: 18px;
  }
`;
const List = styled.div``;
export default function Popular() {
  return (
    <Warraper>
      <Header>
        <div>Popular Posting</div>
        <div></div>
      </Header>
      <List></List>
    </Warraper>
  );
}
