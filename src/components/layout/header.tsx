import { styled } from "styled-components";

const Title = styled.div`
  width: 100%;
  font-size: 25px;
  padding: 20px;
  color: var(--color-brown);
  font-weight: 700;
  border-bottom: 1px solid var(--color-dark-green);
`;

// 1. Props 인터페이스 정의
interface HeaderProps {
  title: string;
}

// 2. 컴포넌트에 Props 타입 적용
const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <>
      <Title>{title}</Title>
    </>
  );
};

export default Header;
