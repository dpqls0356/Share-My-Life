
import { Outlet,Link } from "react-router-dom";
import {styled} from "styled-components"
import {auth} from "../firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PostTweetForm from "./post-tweet-form";
const Wrapper = styled.div`
    position: relative;
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    width: 100%;
    max-height: 100vh;
    max-width: 100%;
    overflow: hidden;
`
const Menu = styled.div`
    display:grid;
    grid-template-rows:0.5fr 2fr;
    
`
const Header= styled.div`
    padding-left:20px;
    padding-top:30px;
`
const Nav = styled.div`
 padding-left:20px;
    width:100%;
`

const NavItem = styled.div`
    width:100%;
    cursor: pointer;
    display: flex;
    align-items: center;
    border: 2px solid 1d9bf0;
    height: 50px;
    border-radius:50% ;
    font-weight:700;
    svg{
        width:30px;
    }
    margin-bottom:10px;
`
const StyledLink = styled(Link)`
    width:100%;
    text-decoration:none; 
    color:black;
`;
const NavName = styled.p`
`
const NavSvg = styled.div`
margin-right:14px;
`
const MiniProfile=styled.div`
    /* border-top:3px solid var(--color-yellow); */
    display:flex;
    align-items:center;
    width:100%;
    gap:10px;
    padding:10px 20px;
    svg{
        color:black;
        width:30px;
        height:30px;
    }
`
const MinProfileCol=styled.div`
`
const UserImage = styled.img`
    width:40px;
    height:40px;
    border-radius: 50%;
`
const UserName = styled.div`
    font-weight:700;
    margin-right:50px;
`
const UserEmail = styled.div`
    margin-top:5px;
    color:gray;
    font-size:13px;
`
const PostFormOpenBtn = styled.button`
    background-color:var(--color-yellow) ;
    width: 90%;
    padding:10px 30px;
    font-size: 15px;
    font-weight: 900;
    border: none;
    text-align: center;
    border-radius: 30px;
`
const Line = styled.div`
    height: 1px;
    width: 90%;
    background-color: var(--color-yellow);
`
export default function Layout(){
    const user = auth.currentUser;
    const [isShowPostForm,setIsShowPostForm] = useState(false);
    const navigate = useNavigate();
    const onLogout = async ()=>{
        const ok = confirm("Are you sure you want to log out?")
        if(ok){
            await auth.signOut();
            navigate("/login");
        }
    }
    const showPostForm=()=>{
        setIsShowPostForm((current)=>!current);
    }
    return (
        <Wrapper>
            <Menu>
                <Header>
                    <img src="/src/assets/img/logo.png" />
                </Header>
                <Nav>
                    <StyledLink to="/profile">
                            <NavItem>
                            <NavSvg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                            </svg>
                            </NavSvg>
                            <NavName>Profile</NavName>
                        </NavItem>
                    </StyledLink>
                    <StyledLink to="/">
                        <NavItem>
                            <NavSvg>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                                    <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                                </svg>
                            </NavSvg>
                            <NavName>Home</NavName>
                        </NavItem>
                    </StyledLink>
                    <StyledLink to="/">
                        <NavItem>
                            <NavSvg>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
                            </svg>
                            </NavSvg>
                            <NavName>Popular</NavName>
                        </NavItem>
                    </StyledLink>
                    <StyledLink to="/">
                        <NavItem>
                            <NavSvg>   
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                            </svg>

                            </NavSvg>
                            <NavName>Bookmarks</NavName>
                        </NavItem>
                    </StyledLink>
                    <Line></Line>
                    <StyledLink to="/">
                        <NavItem>
                            <NavSvg>   
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                                </svg>
                            </NavSvg>
                            <NavName>Notification</NavName>
                        </NavItem>
                    </StyledLink>
                    <StyledLink to="/">
                        <NavItem>
                            <NavSvg>   
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </NavSvg>
                            <NavName>More</NavName>
                        </NavItem>
                    </StyledLink>
                    <PostFormOpenBtn onClick={showPostForm}>Share My Love</PostFormOpenBtn>
                </Nav>
                <MiniProfile>
                        <MinProfileCol>
                            {Boolean(user?.photoURL)?
                            <UserImage src={user?.photoURL || ""}/>:                        
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                                </svg>
                            } 
                        </MinProfileCol>
                        <MinProfileCol>
                            <UserName>
                                {user?.displayName}
                            </UserName>
                            <UserEmail>
                                @{user?.email?.split("@")[0]}
                            </UserEmail>
                        </MinProfileCol>
                        <MinProfileCol style={{alignItems:"flex-end"}}>
                            <StyledLink to="/logout" onClick={onLogout} className="log-out">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6Zm-5.03 4.72a.75.75 0 0 0 0 1.06l1.72 1.72H2.25a.75.75 0 0 0 0 1.5h10.94l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 0 0-1.06 0Z" clipRule="evenodd" />
                                </svg>
                            </StyledLink>
                        </MinProfileCol>
                    </MiniProfile>
            </Menu>
            <Outlet />
            <Menu></Menu>
            {
                isShowPostForm?<PostTweetForm closePostForm={setIsShowPostForm}/>:null
            }
        </Wrapper>
    )
}