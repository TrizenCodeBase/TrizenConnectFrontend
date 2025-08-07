// import Navbar from './components/navbar.component';
// import {Routes, Route} from "react-router-dom";
// import UserAuthForm from './pages/userAuthForm.page';
// import { createContext, useEffect, useState } from "react";
// import { lookInSession } from './common/session';
// import {Editor} from './pages/editor.pages';

// export const UserContext = createContext({})

// const App = () => {

//     const [userAuth, setUserAuth] = useState({});

//     useEffect(() => {

//         let userInSession = lookInSession("user");

//         userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token : null})

//     }, [])

//     return (
//         <>
//         <UserContext.Provider value={{userAuth, setUserAuth}}>
//         <Routes>
//         <Route path="/editor" element={<Editor />} />
//             <Route path="/" element={<Navbar />}>
//                 <Route path="signin" element={<UserAuthForm type="sign-in"/>}/>
//                 <Route path="signup" element={<UserAuthForm type="sign-up"/>}/>
//             </Route>
//         </Routes>
//         </UserContext.Provider>
//         </>
//     );
// }

// export default App;
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let userInSession = lookInSession("user");

    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ access_token: null, profile_img: null, username: null, fullname: null });
  }, []);



  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<Editor />}></Route>
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
          <Route path="search/:query" element={<SearchPage />} />
          <Route path="user/:id" element={<ProfilePage />} />
          <Route path="blog/:id" element={<BlogPage />} />
          <Route path="*" element={<PageNotFound/>} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
