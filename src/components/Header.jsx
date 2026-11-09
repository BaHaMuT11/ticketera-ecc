import {useContext} from "react";
import PropTypes from "prop-types";
import {Ticket} from "lucide-react";
import {UserContext} from "../context/UserProvider.jsx";
import {ThemeSwitch} from "./layout/ThemeSwitch.jsx";
import {PANTALLAS} from "./layout/pantallas.js";

const Header = ({pasoActual}) => {
    const {llamados} = useContext(UserContext);
    const pantalla = PANTALLAS[pasoActual];
    const totalAtenciones = llamados.reduce((total, llamado) => total + llamado.atenciones.length, 0);

    return (
        <header className="flex min-h-[72px] flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-line px-5 py-3 sm:px-8">
            <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-lg bg-brand text-brand-ink lg:hidden">
                    <Ticket className="size-5" aria-hidden="true"/>
                </span>
                <div>
                    <h1 className="text-[22px] font-semibold leading-7 tracking-tight">{pantalla.titulo}</h1>
                    <p className="text-sm text-ink-3">{pantalla.subtitulo}</p>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {pasoActual > 0 && (
                    <>
                        <div className="flex items-center gap-5 text-sm">
                            <div><span className="text-ink-3">Llamados</span> <span className="ml-1 font-semibold">{llamados.length}</span></div>
                            <div><span className="text-ink-3">Atenciones</span> <span className="ml-1 font-semibold">{totalAtenciones}</span></div>
                        </div>
                        <span className="hidden h-6 w-px bg-line sm:block"></span>
                    </>
                )}
                <ThemeSwitch/>
            </div>
        </header>
    );
};

Header.propTypes = {
    pasoActual: PropTypes.number.isRequired
};

export default Header;
