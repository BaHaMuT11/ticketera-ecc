import {useContext} from "react";
import PropTypes from "prop-types";
import {TicketContext} from "../context/TicketProvider.jsx";
import {Panel} from "./ui/Panel.jsx";
import {Field, Input} from "./ui/Field.jsx";

const ReportForm = (props) => {

    const {reporte, setReporte} = useContext(TicketContext);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        props.responsabilidad === "NO" &&
            <Panel className="p-5">
                <form id="formReport" onSubmit={handleSubmit}>
                    <Field label="Reporte" htmlFor="report" hint="Número con el que quedó registrada esta atención.">
                        <Input id="report" name="report" mono value={reporte}
                               onChange={e => setReporte(e.target.value)} required/>
                    </Field>
                </form>
            </Panel>
    );
};

ReportForm.propTypes = {
    responsabilidad: PropTypes.string.isRequired,
}

export default ReportForm;
