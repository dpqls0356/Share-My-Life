import { RouterProvider, createBrowserRouter } from "react-router-dom"
import Layout from "./components/layout"
import Home from "./routes/home.tsx"
import Profile from "./routes/profile.tsx"
import Login from "./routes/login.tsx"
import CreateAccount from "./routes/create-account.tsx"
import { createGlobalStyle } from "styled-components"
import reset from "styled-reset"
import { useEffect, useState } from "react"
import LoadingScreen from "./components/loading-screen.tsx"

const router = createBrowserRouter([
  // /에 레이아웃이 들어가고 path에 따라 outlet컴포넌트는 해당 path컴포넌트로 대체된다.
  {
    path:"/",
    element:<Layout/>,
    children:[
      {
        path:"",
        element:<Home/>
      },
      {
        path:"profile",
        element:<Profile/>
      }  
  ]
  },
  //따로 만드는 이유 : 홈화면과 프로필화면은 인증된 사용자만 접근 가능하기때문
  {
    path:"/login",
    element:<Login/>  
  },{
    path:"/create-account",
    element:<CreateAccount/>
  }
])

const GlobalStyles = createGlobalStyle`
  ${reset};
  *{
    box-sizing: border-box; 
  } 
  body{
    background-color: black;
    color: white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

`


function App() {
  const [isLoading,setIsLoading] = useState(true);
  const init = async()=>{
    //firebase 로그인 여부와 유저 확인
    setTimeout(()=>setIsLoading(false),2000);
    // setIsLoading(false);
  }
  useEffect(()=>{
    init();
  },[])
  return (
    <>
    <GlobalStyles/>
    {isLoading?<LoadingScreen/>:<RouterProvider router={router}/>}
    </>
  )
}

export default App
