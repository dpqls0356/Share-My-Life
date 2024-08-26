import { useEffect, useState } from "react";
import { createGlobalStyle, styled } from "styled-components";
import reset from "styled-reset";
import { auth } from "./firebase.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/layout.tsx";
import Home from "./routes/home.tsx";
import Profile from "./routes/profile.tsx";
import Login from "./routes/login.tsx";
import CreateAccount from "./routes/create-account.tsx";
import LoadingScreen from "./components/loading-screen.tsx";
import ProtectedRoute from "./components/protected-route.tsx";
import AuthProvider from "./components/auth-provider.tsx";

const router = createBrowserRouter([
  // /에 레이아웃이 들어가고 path에 따라 outlet컴포넌트는 해당 path컴포넌트로 대체된다.
  // {
  //   path:"/",
  //   element:<Layout/>,
  //   children:[
  //     {
  //       path:"",
  //       element:<ProtectedRoute><Home/></ProtectedRoute>
  //     },
  //     {
  //       path:"profile",
  //       element:<ProtectedRoute><Profile/></ProtectedRoute>
  //     }
  // ]
  // },
  // 또는 아래 방식
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  //따로 만드는 이유 : 홈화면과 프로필화면은 인증된 사용자만 접근 가능하기때문
  {
    path: "/login",
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
  },
  {
    path: "/create-account",
    element: (
      <AuthProvider>
        <CreateAccount />
      </AuthProvider>
    ),
  },
]);

const GlobalStyles = createGlobalStyle`
  ${reset};
  *{
    box-sizing: border-box; 
  } 
  :root{
  --brown-color:#4b3226;
  --dark-green-color:#AAB396;
  --light-green-color:#F7EED3;
  --begie-color:#FFF8E8;
  
}
body{
  display: flex;
  justify-content: center;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

`;
const Wrapper = styled.div`
  height: 100vh;
  justify-content: center;
`;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const init = async () => {
    //firebase 로그인 여부와 유저 확인
    await auth.authStateReady();

    // setTimeout(()=>setIsLoading(false),2000);
    setIsLoading(false);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <Wrapper>
      <GlobalStyles />
      {isLoading ? <LoadingScreen /> : <RouterProvider router={router} />}
    </Wrapper>
  );
}

export default App;
