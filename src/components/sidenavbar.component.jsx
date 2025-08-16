import { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../App";

const SideNav = () => {

    let { userAuth: { access_token, new_notification_available } } = useContext(UserContext);

    let page = location.pathname.split("/")[2];
    
    let [pageState, setPageState] = useState(page.replace('-', ' '));
    let [showSideNav, setShowSideNav] = useState(false);

    let activeTabLine = useRef();
    let sideBarIconTab = useRef();
    let pageStateTab = useRef();

    const changePageState = (e) => {

        let { offsetWidth, offsetLeft } = e.target;

        activeTabLine.current.style.width = offsetWidth + "px";
        activeTabLine.current.style.left = offsetLeft + "px";

        if(e.target == sideBarIconTab.current){
            setShowSideNav(true);
        } else {
            setShowSideNav(false);
        }
    }

    useEffect(() => {

        setShowSideNav(false);
        setPageState(page.replace('-', ' '));

    }, [page])

    return (
        access_token === null ? <Navigate to="/signin" /> :
        <>

            <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">

                <div className="sticky top-[80px] z-30">

                    <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">

                        <button ref={sideBarIconTab} className="p-5 capitalize" onClick={changePageState}>
                            <i className="fi fi-rr-bars-staggered pointer-events-none"></i>
                        </button>

                        <button ref={pageStateTab} className="p-5 capitalize" onClick={changePageState}>
                            {pageState}
                        </button>

                        <hr ref={activeTabLine} className="absolute bottom-0 duration-500" />

                    </div>

                    <div className={"min-w-[260px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 shadow-lg md:shadow-none " + (!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "opacity-100 pointer-events-auto")}>

                        {/* Dashboard Header */}
                        <div className="mb-8">
                            <h1 className="text-2xl font-bold text-black mb-2">Dashboard</h1>
                            <p className="text-sm text-dark-grey">Manage your content and settings</p>
                        </div>

                        {/* Content Section */}
                        <div className="mb-8">
                            <h2 className="text-sm font-semibold text-dark-grey uppercase tracking-wide mb-4">Content</h2>
                            <nav className="space-y-2">
                                <NavLink 
                                    to="/dashboard/blogs" 
                                    onClick={(e) => setPageState(e.target.innerText)} 
                                    className={({isActive}) => 
                                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            isActive 
                                                ? 'bg-black text-white shadow-md' 
                                                : 'text-dark-grey hover:bg-grey/20 hover:text-black'
                                        }`
                                    }
                                >
                                    <i className="fi fi-rr-document text-base"></i>
                                    <span>Manage Blogs</span>
                                </NavLink>

                                <NavLink 
                                    to="/dashboard/notifications" 
                                    onClick={(e) => setPageState(e.target.innerText)} 
                                    className={({isActive}) => 
                                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            isActive 
                                                ? 'bg-black text-white shadow-md' 
                                                : 'text-dark-grey hover:bg-grey/20 hover:text-black'
                                        }`
                                    }
                                >
                                    <div className="relative">
                                        <i className="fi fi-rr-bell text-base"></i>
                                        {new_notification_available && (
                                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red rounded-full"></span>
                                        )}
                                    </div>
                                    <span>Notifications</span>
                                    {new_notification_available && (
                                        <span className="ml-auto bg-red text-white text-xs px-2 py-1 rounded-full">
                                            New
                                        </span>
                                    )}
                                </NavLink>

                                <NavLink 
                                    to="/editor" 
                                    onClick={(e) => setPageState(e.target.innerText)} 
                                    className={({isActive}) => 
                                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            isActive 
                                                ? 'bg-black text-white shadow-md' 
                                                : 'text-dark-grey hover:bg-grey/20 hover:text-black'
                                        }`
                                    }
                                >
                                    <i className="fi fi-rr-edit text-base"></i>
                                    <span>Write New Blog</span>
                                </NavLink>
                            </nav>
                        </div>

                        {/* Settings Section */}
                        <div>
                            <h2 className="text-sm font-semibold text-dark-grey uppercase tracking-wide mb-4">Settings</h2>
                            <nav className="space-y-2">
                                <NavLink 
                                    to="/settings/edit-profile" 
                                    onClick={(e) => setPageState(e.target.innerText)} 
                                    className={({isActive}) => 
                                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            isActive 
                                                ? 'bg-black text-white shadow-md' 
                                                : 'text-dark-grey hover:bg-grey/20 hover:text-black'
                                        }`
                                    }
                                >
                                    <i className="fi fi-rr-user text-base"></i>
                                    <span>Edit Profile</span>
                                </NavLink>

                                <NavLink 
                                    to="/settings/change-password" 
                                    onClick={(e) => setPageState(e.target.innerText)} 
                                    className={({isActive}) => 
                                        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                            isActive 
                                                ? 'bg-black text-white shadow-md' 
                                                : 'text-dark-grey hover:bg-grey/20 hover:text-black'
                                        }`
                                    }
                                >
                                    <i className="fi fi-rr-lock text-base"></i>
                                    <span>Change Password</span>
                                </NavLink>
                            </nav>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-8 pt-6 border-t border-grey/20">
                            <NavLink 
                                to="/editor" 
                                className="w-full bg-black text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-dark-grey transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                <i className="fi fi-rr-plus text-sm"></i>
                                Create New Blog
                            </NavLink>
                        </div>

                    </div>

                </div>

                <div className="max-md:-mt-8 mt-5 w-full">
                    <Outlet />
                </div>

            </section>

        </>
    )
}

export default SideNav;
