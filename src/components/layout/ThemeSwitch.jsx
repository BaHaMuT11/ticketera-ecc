import {useContext} from "react";
import {Monitor, Moon, Sun} from "lucide-react";
import {ThemeContext} from "../../context/ThemeProvider.jsx";

const OPCIONES = [
    {valor: "claro", etiqueta: "Claro", Icono: Sun},
    {valor: "oscuro", etiqueta: "Oscuro", Icono: Moon},
    {valor: "sistema", etiqueta: "Seguir al sistema", Icono: Monitor, soloIcono: true}
];

export const ThemeSwitch = () => {
    const {tema, setTema} = useContext(ThemeContext);

    return (
        <div role="group" aria-label="Tema de la aplicación"
             className="inline-flex items-center gap-0.5 rounded-lg border border-line bg-surface-2 p-0.5">
            {OPCIONES.map(({valor, etiqueta, Icono, soloIcono}) => (
                <button
                    key={valor}
                    type="button"
                    title={etiqueta}
                    aria-label={etiqueta}
                    aria-pressed={tema === valor}
                    onClick={() => setTema(valor)}
                    className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-sm transition-colors ${
                        tema === valor
                            ? "bg-surface font-medium text-ink shadow-sm"
                            : "text-ink-3 hover:text-ink"}`}>
                    <Icono className="size-4" aria-hidden="true"/>
                    {!soloIcono && <span className="hidden sm:inline">{etiqueta}</span>}
                </button>
            ))}
        </div>
    );
};
