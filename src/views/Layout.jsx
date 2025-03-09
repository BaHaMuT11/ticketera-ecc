import Header from "../components/Header.jsx";
import {Outlet} from "react-router";

const Layout = () => {
    return (
        <div className="container">
            <div className="row mb-2">
                <Header />
            </div>
            <div className="row mb-2">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;