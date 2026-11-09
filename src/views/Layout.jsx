import {Outlet, useLocation} from "react-router";
import Header from "../components/Header.jsx";
import {Sidebar} from "../components/layout/Sidebar.jsx";
import {indiceDePantalla} from "../components/layout/pantallas.js";

const Layout = () => {
    const {pathname} = useLocation();
    const pasoActual = indiceDePantalla(pathname);

    return (
        <div className="flex min-h-screen">
            <Sidebar pasoActual={pasoActual}/>
            <div className="min-w-0 flex-1">
                <Header pasoActual={pasoActual}/>
                <main className="mx-auto max-w-[1280px] px-5 py-6 sm:px-8 sm:py-7">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};

export default Layout;
