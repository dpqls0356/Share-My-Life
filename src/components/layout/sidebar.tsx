import styled from "styled-components";
import Popular from "../sidebar/Popular";
import Recommend from "../sidebar/Recommend";
const Wrapper = styled.div`
  padding: 10px 20px;
`;
const SearchBar = styled.div`
  .search-bar {
    background-color: var(--color-dark-green);
    display: flex;
    align-items: center;
    /* border: 1px solid black; */
    border-radius: 30px;
    padding: 5px 20px;
    width: 100%;
    height: 50px;
    * {
      background-color: var(--color-dark-green);
    }
    input {
      font-size: 15px;
      margin-left: 10px;
      flex: 1;
      border: none;
    }
    input:focus {
      outline: none;
    }
  }
  svg {
    width: 20px;
    height: 20px;
  }
`;
export default function Sidebar() {
  return (
    <Wrapper>
      <SearchBar>
        <div className="search-bar">
          <input type="text" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </div>
      </SearchBar>
      <Recommend />
      <Popular />
    </Wrapper>
  );
}
