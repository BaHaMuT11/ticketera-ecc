import {createContext, useCallback, useMemo, useRef, useState} from "react";
import PropTypes from "prop-types";
import {CircleCheck, TriangleAlert} from "lucide-react";

// eslint-disable-next-line react-refresh/only-export-components
export const ToastContext = createContext(null);

const DURACION_MS = 3000;

/**
 * Avisos breves en pantalla (reemplazan a alert()).
 * Uso: const {toast} = useContext(ToastContext); toast("Mensaje") o toast("Error", "error")
 */
export const ToastProvider = ({children}) => {
    const [avisos, setAvisos] = useState([]);
    const siguienteId = useRef(0);

    const toast = useCallback((mensaje, tipo = "ok") => {
        const id = siguienteId.current++;
        setAvisos((actuales) => [...actuales, {id, mensaje, tipo}]);
        setTimeout(() => {
            setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id));
        }, DURACION_MS);
    }, []);

    const valor = useMemo(() => ({toast}), [toast]);

    return (
        <ToastContext.Provider value={valor}>
            {children}
            <div aria-live="polite" role="status"
                 className="pointer-events-none fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-2">
                {avisos.map((aviso) => (
                    <div key={aviso.id}
                         className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-[15px] text-ink shadow-lg">
                        <span className={`grid size-7 shrink-0 place-items-center rounded-full ${
                            aviso.tipo === "error" ? "bg-danger-soft text-danger" : "bg-ok-soft text-ok"}`}>
                            {aviso.tipo === "error"
                                ? <TriangleAlert className="size-4" aria-hidden="true"/>
                                : <CircleCheck className="size-4" aria-hidden="true"/>}
                        </span>
                        {aviso.mensaje}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

ToastProvider.propTypes = {
    children: PropTypes.node
};
