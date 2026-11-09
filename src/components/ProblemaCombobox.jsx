import {useId, useMemo, useState} from "react";
import PropTypes from "prop-types";
import {Input} from "./ui/Field.jsx";
import {buscarGlosa} from "../utilities/GlosaSearch.js";

const quitarPrefijo = (plantilla) => plantilla.replace(/^Reconfigurar\s*-\s*/i, "");

/**
 * Campo "Problema" con sugerencias de la glosa.
 * Se busca por código (DECA001), por parte del código (deca) o por palabras.
 * Al elegir una sugerencia se llama a onSelect(item) para que el formulario complete los demás campos.
 * Si no se elige nada, el campo se comporta como un texto libre.
 */
const ProblemaCombobox = ({id, name, value, onChange, onSelect, required}) => {
    const idLista = useId();
    const [abierto, setAbierto] = useState(false);
    const [activo, setActivo] = useState(0);

    const resultados = useMemo(() => (abierto ? buscarGlosa(value) : []), [abierto, value]);
    const visible = abierto && resultados.length > 0;

    const elegir = (item) => {
        onSelect(item);
        setAbierto(false);
    };

    const alCambiar = (e) => {
        onChange(e);
        setAbierto(true);
        setActivo(0);
    };

    const alTeclear = (e) => {
        if (!visible) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActivo((actual) => (actual + 1) % resultados.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActivo((actual) => (actual - 1 + resultados.length) % resultados.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            elegir(resultados[activo]);
        } else if (e.key === "Escape") {
            e.preventDefault();
            setAbierto(false);
        }
    };

    return (
        <div className="relative">
            <Input
                id={id}
                name={name}
                value={value}
                onChange={alCambiar}
                onKeyDown={alTeclear}
                onBlur={() => setAbierto(false)}
                required={required}
                autoComplete="off"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={visible}
                aria-controls={idLista}
                aria-activedescendant={visible ? `${idLista}-${activo}` : undefined}
            />
            {visible && (
                <div className="absolute right-0 top-full z-30 mt-1.5 w-[560px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-xl border border-line bg-surface shadow-xl">
                    <ul id={idLista} role="listbox" aria-label="Sugerencias de la glosa" className="max-h-80 overflow-y-auto py-1">
                        {resultados.map((item, i) => (
                            <li
                                key={item.codigo}
                                id={`${idLista}-${i}`}
                                role="option"
                                aria-selected={i === activo}
                                // mousedown (y no click) para elegir antes de que el campo pierda el foco
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    elegir(item);
                                }}
                                onMouseEnter={() => setActivo(i)}
                                className={`cursor-pointer px-4 py-2.5 ${i === activo ? "bg-brand-soft" : ""}`}>
                                <div className="text-[14px] leading-5">
                                    <span className="font-mono font-medium text-brand">{item.codigo}</span>
                                    <span className="text-ink-3"> - </span>
                                    <span className="text-ink">{item.inconveniente}</span>
                                </div>
                                <div className="mt-0.5 text-[13px] text-ink-3">{quitarPrefijo(item.plantilla)}</div>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t border-line bg-surface-2 px-4 py-2 text-[13px] text-ink-3">
                        ↑ ↓ para moverte, Enter para elegir, Esc para cerrar
                    </div>
                </div>
            )}
        </div>
    );
};

ProblemaCombobox.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    required: PropTypes.bool
};

export default ProblemaCombobox;
