import {useEffect, useRef, useState} from "react";
import PropTypes from "prop-types";
import {Check, X} from "lucide-react";

const CAMPO = "h-8 rounded-md border border-brand bg-surface px-2 text-[14px] text-ink outline-none ring-2 ring-brand/25";
const BOTON = "grid size-8 shrink-0 place-items-center rounded-md border border-line bg-surface text-ink-2 hover:bg-surface-2 hover:text-ink";

/**
 * Celda editable: con doble clic (o Enter / F2 estando enfocada) se reemplaza por un campo con el valor actual.
 * - Enter, el botón ✓ o hacer clic fuera consolidan el cambio.
 * - Escape o el botón ✕ lo descartan.
 * - Si el valor no cambió (o quedó vacío) se mantiene el original y no se llama a onCommit.
 * En las listas desplegables el cambio se consolida apenas se elige una opción.
 */
const EditableCell = ({value, label, titulo, type = "text", options = [], mono = false, normalizar = (v) => v, onCommit, children}) => {
    const [editando, setEditando] = useState(false);
    const [borrador, setBorrador] = useState(value);
    const campo = useRef(null);
    // Evita consolidar dos veces (p. ej. Enter y luego el blur que provoca desmontar el campo).
    const finalizado = useRef(true);

    useEffect(() => {
        if (!editando) return;
        campo.current?.focus();
        if (type === "text") campo.current?.select();
    }, [editando, type]);

    const abrir = () => {
        finalizado.current = false;
        setBorrador(value);
        setEditando(true);
    };

    const cerrar = () => {
        finalizado.current = true;
        setEditando(false);
    };

    const consolidar = (nuevo = borrador) => {
        if (finalizado.current) return;
        const limpio = normalizar(nuevo);
        cerrar();
        if (limpio === "" || limpio === value) return;
        onCommit(limpio);
    };

    const alTeclear = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            consolidar();
        } else if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            cerrar();
        }
    };

    if (!editando) {
        return (
            <span
                role="button"
                tabIndex={0}
                title={titulo ?? `Doble clic para editar ${label.toLowerCase()}`}
                onDoubleClick={abrir}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === "F2") {
                        e.preventDefault();
                        abrir();
                    }
                }}
                className="-mx-1.5 inline-block min-h-6 min-w-8 cursor-text rounded-md px-1.5 py-0.5 hover:bg-surface-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand">
                {children}
            </span>
        );
    }

    if (type === "select") {
        return (
            <select
                ref={campo}
                aria-label={label}
                value={borrador}
                className={`${CAMPO} min-w-[10rem] pr-1`}
                onChange={(e) => {
                    setBorrador(e.target.value);
                    consolidar(e.target.value);
                }}
                onBlur={() => consolidar()}
                onKeyDown={alTeclear}>
                {options.map((opcion) => (
                    <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
                ))}
            </select>
        );
    }

    return (
        <span className="-mx-1.5 flex items-center gap-1">
            <input
                ref={campo}
                type={type}
                aria-label={label}
                value={borrador}
                className={`${CAMPO} ${type === "datetime-local" ? "w-[13.5rem]" : "w-full min-w-[8rem]"} ${mono ? "font-mono text-[13.5px]" : ""}`}
                onChange={(e) => setBorrador(e.target.value)}
                onBlur={() => consolidar()}
                onKeyDown={alTeclear}/>
            {/* mouseDown no quita el foco del campo: así el clic en el botón no dispara antes el "clic fuera". */}
            <button type="button" aria-label="Guardar cambio" className={BOTON}
                    onMouseDown={(e) => e.preventDefault()} onClick={() => consolidar()}>
                <Check className="size-4" aria-hidden="true"/>
            </button>
            <button type="button" aria-label="Descartar cambio" className={BOTON}
                    onMouseDown={(e) => e.preventDefault()} onClick={cerrar}>
                <X className="size-4" aria-hidden="true"/>
            </button>
        </span>
    );
};

EditableCell.propTypes = {
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    titulo: PropTypes.string,
    type: PropTypes.oneOf(["text", "select", "datetime-local"]),
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
    })),
    mono: PropTypes.bool,
    normalizar: PropTypes.func,
    onCommit: PropTypes.func.isRequired,
    children: PropTypes.node
};

export default EditableCell;
