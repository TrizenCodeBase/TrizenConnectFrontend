import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Navigate, Outlet } from "react-router-dom";
import SideNav from "../components/sidenavbar.component";

const Dashboard = () => {
    const { userAuth: { access_token, new_notification_available } } = useContext(UserContext);
    const [pageState, setPageState] = useState("Dashboard");

    useEffect(() => {
        // Extract the current page from URL
        const currentPath = location.pathname.split("/")[2];
        setPageState(currentPath ? currentPath.replace('-', ' ') : 'dashboard');
    }, []);

    return (
        access_token === null ? <Navigate to="/signin" /> :
        <>
            <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
                
                <SideNav />

                <div className="max-md:-mt-8 mt-5 w-full">
                    <Outlet />
                </div>

            </section>
        </>
    )
}

export default Dashboard;
