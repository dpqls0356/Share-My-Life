import { styled } from "styled-components";

const Title = styled.div`
  padding: 20px;
  border-bottom: 1px solid var(--color-yellow);
  font-weight: 700;
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
