// import AnimationWrapper from "../common/page-animation";
// import { UseContext } from "react";
// import {Link } from "react-router-dom";
// import { UserContext } from "../App"; 
// import { removeFromSession } from "../common/session";

// const UserNavigationPanel = () => {

//     const { userAuth: {username}, setUserAuth } = useContext(UserContext);

//     const signOutUser = () => {
//         removeFromSession("user");
//         setUserAuth({ access_token :null })
//     }

//     return(
//         <AnimationWrapper 
//         className="absolute right-0 z-50"
//         tansition={{duration: 0.2, }}
//         >
//             <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
//                 <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
//                     <i className="fi fi-rr-file-edit"></i>
//                     <p>write</p>
//                 </Link>

//                 <Link to={`/user/${username}`} className="link pl-8 py-4">
//                     Profile
//                 </Link>

//                 <Link to="/dashboard/blogs" className="link pl-8 py-4">
//                     Dashboard
//                 </Link>

//                 <Link to="/settings/edit-profile" className="link pl-8 py-4">
//                     Settings
//                 </Link>

//                 <span className="absolute border-t border-grey -ml-6 w-[100%]"></span>

//                 <button className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
//                 onClick={signOutUser}>
//                     <h1 className="font-bold text-xl mg-l">Sign Out</h1>
//                     <p className="text-dark-grey">@{username}</p>
//                 </button>

//             </div>
//         </AnimationWrapper>
//     )
// }
// export default UserNavigationPanel;
import { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {
  const navigate = useNavigate();
  const {
    userAuth, setUserAuth
  } = useContext(UserContext);
  
  console.log("UserNavigationPanel rendered with userAuth:", userAuth);
  
  const signOutUser = () => {
    console.log("signOutUser function called!");
    // Clear session first
    removeFromSession("user");
    
    // Update state
    setUserAuth({ access_token: null, profile_img: null, username: null, fullname: null });
    
    // Force a page reload to ensure clean state
    window.location.href = "/";
  }

  return (
    <AnimationWrapper
      className="absolute right-0 z-50"
      transition={{ duration: 0.2 }}
    >
      <div className="bg-white absolute right-0 border border-grey w-60 duration-200">
        <Link to="/editor" className="flex gap-3 items-center text-dark-grey hover:text-black hover:bg-grey/30 pl-8 py-4 text-base font-medium transition-colors duration-200 md:hidden">
          <i className="fi fi-rr-file-edit text-base"></i>
          <span>Write</span>
        </Link>

        <Link to={`/user/${userAuth.username}`} className="block text-dark-grey hover:text-black hover:bg-grey/30 pl-8 py-4 text-base font-medium transition-colors duration-200">
          Profile
        </Link>

        <Link to="/dashboard" className="block text-dark-grey hover:text-black hover:bg-grey/30 pl-8 py-4 text-base font-medium transition-colors duration-200">
          Dashboard
        </Link>

        <Link to="/settings/edit-profile" className="block text-dark-grey hover:text-black hover:bg-grey/30 pl-8 py-4 text-base font-medium transition-colors duration-200">
          Settings
        </Link>

        <div className="border-t border-grey my-2"></div>

        <button 
          className="text-left w-full pl-8 py-4 hover:bg-grey/30 transition-colors duration-200 group" 
          onClick={(e) => {
            console.log("Sign out button clicked!");
            e.preventDefault();
            e.stopPropagation();
            signOutUser();
          }}
        >
            <div className="text-dark-grey group-hover:text-black text-base font-medium mb-1 transition-colors duration-200">Sign Out</div>
            <div className="text-dark-grey group-hover:text-black text-sm transition-colors duration-200">@{userAuth.username}</div>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
