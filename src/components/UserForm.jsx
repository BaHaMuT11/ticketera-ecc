import {useContext, useEffect, useState} from "react";
import {UserContext} from "../context/UserProvider.jsx";
import {useNavigate} from "react-router";
import axios from "axios";
import {ArrowRight} from "lucide-react";
import {Button} from "./ui/Button.jsx";
import {Field, Input} from "./ui/Field.jsx";
import {Slip} from "./ui/Slip.jsx";

const EJEMPLO = [
    ["TIPO DE ESTACION:", "ETF"],
    ["NOMBRE DE MÁQUINA:", "ETF-0042"],
    ["NOMBRE:", "MARCELA FUENTES"],
    ["OFICINA:", "SRCEI CONCEPCIÓN"],
    ["IP:", "164.96.120.34"],
    ["PROBLEMA:", "NO INICIA MÓDULO DE CAPTURA"]
];

const UserForm = () => {

    const {userName, setUserName, inventario, setInventario} = useContext(UserContext);
    const [errorInventario, setErrorInventario] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name,value,type,checked} = e.target;
        setUserName({
            ...userName,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/baha-ticket");
    };

    useEffect(() => {
        axios.get("https://bahamut11.github.io/logical-Inventory/inventario.json")
            .then(response => {
                setInventario(response.data);
                setErrorInventario(false);
            })
            .catch(error => {
                console.error('Error al cargar el inventario:', error);
                setErrorInventario(true);
            });
    }, [setInventario]);

    const estadoInventario = errorInventario ? "error" : inventario.length > 0 ? "listo" : "cargando";

    return (
        <div className="mx-auto grid min-h-[560px] max-w-[1040px] items-center gap-12 lg:grid-cols-[1fr_440px] lg:gap-16">
            <div>
                <h2 className="text-[40px] font-semibold leading-[1.1] tracking-tight">¿Quién atiende hoy?</h2>
                <p className="mt-3 max-w-[44ch] text-[17px] leading-7 text-ink-2">
                    Tu nombre aparece en el correo de responsabilidad y en el resumen del día.
                </p>
                <form id="formUser" onSubmit={handleSubmit} className="mt-8 max-w-[420px]">
                    <Field label="Nombre" htmlFor="nombre2">
                        <Input id="nombre2" name="nombre2" className="h-12 text-base" autoFocus
                               value={userName.nombre2} onChange={handleChange} required/>
                    </Field>
                    <Button type="submit" icon={ArrowRight} full className="mt-5">Comenzar turno</Button>
                </form>
                <div className="mt-8 inline-flex items-center gap-2.5 rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink-2" role="status">
                    <span className={`size-2 rounded-full ${estadoInventario === "listo" ? "bg-ok" : estadoInventario === "error" ? "bg-danger" : "animate-pulse bg-ink-3"}`}></span>
                    {estadoInventario === "listo" && `Inventario de equipos cargado: ${inventario.length.toLocaleString("es-CL")} registros`}
                    {estadoInventario === "cargando" && "Cargando inventario de equipos..."}
                    {estadoInventario === "error" && "No se pudo cargar el inventario. Las validaciones por IP o máquina no estarán disponibles."}
                </div>
            </div>
            <div>
                <div className="mb-3 text-sm font-medium text-ink-2">Así queda un ticket</div>
                <Slip title="Ticket" sub="Listo para copiar y pegar">
                    <div className="font-mono text-[12.5px] leading-[1.7]">
                        {EJEMPLO.map(([clave, valor]) => (
                            <div key={clave}><span className="text-ink-3">{clave}</span> <span className="font-medium text-ink">{valor}</span></div>
                        ))}
                    </div>
                </Slip>
            </div>
        </div>
    );
};

export default UserForm;
