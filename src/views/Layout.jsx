import {useContext} from "react";
import {Outlet, useLocation} from "react-router";
import Header from "../components/Header.jsx";
import HistorialLlamados from "../components/HistorialLlamados.jsx";
import {Sidebar} from "../components/layout/Sidebar.jsx";
import {indiceDePantalla} from "../components/layout/pantallas.js";
import {UserContext} from "../context/UserProvider.jsx";
import {TicketContext} from "../context/TicketProvider.jsx";
import {useAvisoAlSalir} from "../hooks/useAvisoAlSalir.js";
import {TICKET_INICIAL} from "../utilities/EstadosIniciales.js";

const Layout = () => {
    const {pathname} = useLocation();
    const pasoActual = indiceDePantalla(pathname);

    const {llamados, llamadoActivo} = useContext(UserContext);
    const {ticketFormData, ticket} = useContext(TicketContext);

    // Hay trabajo sin cerrar si existen atenciones registradas o un ticket a medio llenar.
    // Tras "Cerrar día" todo vuelve a su estado inicial y ya se puede salir sin aviso.
    const formularioConDatos = ticket !== "" || JSON.stringify(ticketFormData) !== JSON.stringify(TICKET_INICIAL);
    useAvisoAlSalir(llamados.length > 0 || llamadoActivo.atenciones.length > 0 || formularioConDatos);

    return (
        <div className="flex min-h-screen">
            <Sidebar pasoActual={pasoActual}/>
            <div className="min-w-0 flex-1">
                <Header pasoActual={pasoActual}/>
                {/* pb-28: deja espacio para que el botón flotante no tape el final de la página */}
                <main className="mx-auto max-w-[1280px] px-5 pb-28 pt-6 sm:px-8 sm:pt-7">
                    <Outlet/>
                </main>
            </div>
            <HistorialLlamados/>
        </div>
    );
};

export default Layout;
