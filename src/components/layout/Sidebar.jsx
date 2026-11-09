import {useContext} from "react";
import PropTypes from "prop-types";
import {Check, Ticket, User} from "lucide-react";
import {UserContext} from "../../context/UserProvider.jsx";
import {PANTALLAS} from "./pantallas.js";

const iniciales = (nombre) =>
    nombre.trim().split(/\s+/).slice(0, 2).map((parte) => parte[0]?.toUpperCase() ?? "").join("");

const Paso = ({numero, actual, paso, detalle, ultimo}) => {
    const estado = numero < actual ? "hecho" : numero === actual ? "actual" : "pendiente";
    return (
        <li className="relative flex gap-3 pb-6 last:pb-0" aria-current={estado === "actual" ? "step" : undefined}>
            {!ultimo && (
                <span className={`absolute left-[13px] top-8 h-[calc(100%-2rem)] w-px ${estado === "hecho" ? "bg-brand" : "bg-line"}`}></span>
            )}
            {estado === "hecho" && (
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand text-brand-ink">
                    <Check className="size-3.5" aria-hidden="true"/>
                </span>
            )}
            {estado === "actual" && (
                <span className="grid size-7 shrink-0 place-items-center rounded-full border-2 border-brand bg-brand-soft text-[13px] font-semibold text-brand">{numero}</span>
            )}
            {estado === "pendiente" && (
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line bg-surface text-[13px] font-medium text-ink-3">{numero}</span>
            )}
            <div className="pt-0.5">
                <div className={`text-[15px] leading-5 ${estado === "pendiente" ? "font-medium text-ink-3" : estado === "actual" ? "font-semibold text-ink" : "font-medium text-ink"}`}>{paso}</div>
                <div className="text-[13px] leading-5 text-ink-3">{detalle}</div>
            </div>
        </li>
    );
};

Paso.propTypes = {
    numero: PropTypes.number.isRequired,
    actual: PropTypes.number.isRequired,
    paso: PropTypes.string.isRequired,
    detalle: PropTypes.string.isRequired,
    ultimo: PropTypes.bool.isRequired
};

export const Sidebar = ({pasoActual}) => {
    const {userName} = useContext(UserContext);
    const nombre = userName.nombre2.trim();

    return (
        <aside className="hidden w-[256px] shrink-0 flex-col border-r border-line bg-surface px-5 py-6 lg:flex">
            <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-brand text-brand-ink">
                    <Ticket className="size-5" aria-hidden="true"/>
                </span>
                <div>
                    <div className="text-[17px] font-semibold leading-5 tracking-tight">Ticketera ECC</div>
                    <div className="text-[13px] leading-5 text-ink-3">Versión 4.0.1</div>
                </div>
            </div>

            <nav aria-label="Flujo del llamado" className="mt-9">
                <div className="text-sm font-medium text-ink-2">Flujo del llamado</div>
                <ol className="mt-2">
                    {PANTALLAS.map((p, i) => (
                        <Paso key={p.ruta} numero={i + 1} actual={pasoActual + 1}
                              paso={p.paso} detalle={p.detalle} ultimo={i === PANTALLAS.length - 1}/>
                    ))}
                </ol>
            </nav>

            <div className="mt-auto">
                <div className="rounded-xl border border-line bg-surface-2 p-3">
                    {nombre ? (
                        <div className="flex items-center gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand">{iniciales(nombre)}</span>
                            <div className="min-w-0">
                                <div className="truncate text-sm font-medium">{nombre}</div>
                                <div className="text-[13px] text-ink-3">Atendiendo hoy</div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-line text-ink-3">
                                <User className="size-4" aria-hidden="true"/>
                            </span>
                            <div>
                                <div className="text-sm font-medium text-ink-2">Sin sesión</div>
                                <div className="text-[13px] text-ink-3">Ingresa tu nombre</div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="mt-3 text-center text-[13px] text-ink-3">By BaHaMuT</div>
            </div>
        </aside>
    );
};

Sidebar.propTypes = {
    pasoActual: PropTypes.number.isRequired
};
