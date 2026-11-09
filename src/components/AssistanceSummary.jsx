import {useContext} from "react";
import {UserContext} from "../context/UserProvider.jsx";
import {useNavigate} from "react-router";
import {ArrowRight, List} from "lucide-react";
import {Panel} from "./ui/Panel.jsx";
import {Chip} from "./ui/Chip.jsx";
import {Button} from "./ui/Button.jsx";
import ResolucionChip from "./ResolucionChip.jsx";


const AssistanceSummary = () => {

    const {llamadoActivo, llamados, setLlamados, esLlamadoNuevo, idLLamadoActiva, setIdLLamadoActiva} = useContext(UserContext);

    const navigate = useNavigate();

    const handleEnding = () => {
        if (esLlamadoNuevo){
            setIdLLamadoActiva(llamadoActivo.id);
            setLlamados([...llamados, llamadoActivo]);
        } else {
            let respaldo = llamados.map(llamado => ({ ...llamado }));
            respaldo = respaldo.map(llamado =>
                llamado.id === idLLamadoActiva ? llamadoActivo : llamado
            );
            setLlamados(respaldo);
        }
        navigate("/baha-summary");
    }

    const total = llamadoActivo.atenciones.length;

    return (
        <div className="mx-auto max-w-[820px]">
            <Panel>
                <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
                    <div>
                        <div className="text-sm text-ink-3">Llamado {llamadoActivo.id}</div>
                        <h2 className="text-xl font-semibold tracking-tight">{llamadoActivo.oficina || "Sin oficina"}</h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-ink-2">
                        <List className="size-4" aria-hidden="true"/>
                        {total} {total === 1 ? "atención" : "atenciones"}
                    </div>
                </div>
                <div className="divide-y divide-line">
                    {llamadoActivo.atenciones.map(atencion => (
                        <div key={atencion.id} className="grid items-center gap-x-5 gap-y-3 px-6 py-4 sm:grid-cols-[170px_1fr_auto]">
                            <div>
                                <div className="font-mono text-[14px] font-medium">{atencion.ticket}</div>
                                <div className="text-[13px] text-ink-3">{atencion.fecha}</div>
                            </div>
                            <div className="text-[15px]">
                                {atencion.funcionario}
                                <div className="text-[13px] text-ink-3">Funcionario</div>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <ResolucionChip resolucion={atencion.resolucion}/>
                                <Chip>{atencion.responsabilidad === "SI" ? "Del SRCeI" : "Externa"}</Chip>
                            </div>
                        </div>
                    ))}
                    {total === 0 && (
                        <p className="px-6 py-8 text-[15px] text-ink-2">Todavía no hay atenciones en este llamado. Crea un ticket para registrar la primera.</p>
                    )}
                </div>
            </Panel>
            <div className="mt-5">
                <Button icon={ArrowRight} full onClick={handleEnding}>Continuar</Button>
            </div>
        </div>
    );
};

export default AssistanceSummary;
