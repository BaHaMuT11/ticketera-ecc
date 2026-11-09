import {useContext} from 'react';
import {TicketContext} from "../../context/TicketProvider.jsx";
import {formTransform} from "../../utilities/FormTransform.js";
import {StringBuilder} from "../../utilities/StringBuilder.js";
import PropTypes from "prop-types";
import {Field, Input, Select} from "../ui/Field.jsx";
import {Button} from "../ui/Button.jsx";

const OficioModal = (props) => {

    const {oficioForm, setOficioForm, setOficio, ticket, setTicket} = useContext(TicketContext);

    const handleChange = (e) => {
        const {name,value,type,checked} = e.target;
        setOficioForm({
            ...oficioForm,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const numeroOficio = "N° DE OFICIO: " + formTransform(oficioForm.numeroOficio);
        const sb = new StringBuilder(numeroOficio);
        sb.appendLine("TIPO DE OFICIO: " + formTransform(oficioForm.tipoOficio));
        sb.appendLine("AÑO OFICIO: " + formTransform(oficioForm.anioOficio));
        sb.appendLine("COD. OFICINA ORIGEN: " + formTransform(oficioForm.codigoOficina));
        sb.appendLine("RUN: " + formTransform(oficioForm.run));
        sb.appendLine("");

        const sb2 = new StringBuilder(ticket);

        const ofi = sb.toString();
        setOficio(ofi);
        sb2.appendLine(ofi);
        setTicket(sb2.toString());

        props.cerrarModal();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="space-y-4 px-6 py-5">
                <Field label="N° de oficio" htmlFor="numeroOficio">
                    <Input id="numeroOficio" name="numeroOficio" mono
                           value={oficioForm.numeroOficio} onChange={handleChange}/>
                </Field>
                <Field label="Tipo de oficio" htmlFor="tipoOficio">
                    <Select id="tipoOficio" name="tipoOficio" value={oficioForm.tipoOficio} onChange={handleChange}>
                        <option value="CÉDULA">CÉDULA</option>
                        <option value="PASAPORTE">PASAPORTE</option>
                        <option value="CÉDULA Y PASAPORTE">MIXTO</option>
                    </Select>
                </Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Año del oficio" htmlFor="anioOficio">
                        <Input id="anioOficio" name="anioOficio" type="number" mono
                               value={oficioForm.anioOficio} onChange={handleChange}/>
                    </Field>
                    <Field label="Cód. oficina origen" htmlFor="codigoOficina">
                        <Input id="codigoOficina" name="codigoOficina" mono
                               value={oficioForm.codigoOficina} onChange={handleChange}/>
                    </Field>
                </div>
                <Field label="RUN" htmlFor="run" hint="Cualquiera que esté en el oficio">
                    <Input id="run" name="run" mono value={oficioForm.run} onChange={handleChange}/>
                </Field>
            </div>
            <div className="flex justify-end border-t border-line px-6 py-4">
                <Button type="submit">Agregar oficio</Button>
            </div>
        </form>
    );
};

OficioModal.propTypes = {
    cerrarModal: PropTypes.func.isRequired
};

export default OficioModal;
