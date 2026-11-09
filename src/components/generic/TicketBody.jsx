import {useContext, useEffect, useId, useState} from "react";
import PropTypes from "prop-types";
import {Copy} from "lucide-react";
import {ToastContext} from "../../context/ToastProvider.jsx";
import {Slip} from "../ui/Slip.jsx";
import {Button} from "../ui/Button.jsx";

const TicketBody = (props) => {

    const {toast} = useContext(ToastContext);
    const idTexto = useId();
    const [text, setText] = useState(props.text);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            toast("Ticket copiado al portapapeles ;)");
        } catch (err) {
            console.error("Error al copiar :(", err);
            toast("No se pudo copiar. Selecciona el texto y cópialo a mano.", "error");
        }
    };

    const onChange = (e) => {
        setText(e.target.value);
        props.setter(e.target.value);
    }

    useEffect(() => {
        setText(props.text);
    }, [props.text]);

    return (
        <Slip
            title={props.title}
            sub={props.sub}
            action={<Button variant="ghost" size="sm" icon={Copy} onClick={handleCopy}>{props.copyLabel ?? "Copiar"}</Button>}>
            <label htmlFor={idTexto} className="sr-only">{props.title}</label>
            <textarea
                id={idTexto}
                className="block w-full resize-y bg-transparent font-mono text-[12.5px] leading-[1.7] text-ink placeholder:text-ink-3"
                rows={props.rows}
                value={text}
                placeholder={props.placeholder}
                onChange={onChange}/>
        </Slip>
    );
};

TicketBody.propTypes = {
    title: PropTypes.string.isRequired,
    sub: PropTypes.node,
    text: PropTypes.string.isRequired,
    setter: PropTypes.func.isRequired,
    rows: PropTypes.number.isRequired,
    copyLabel: PropTypes.string,
    placeholder: PropTypes.string
}

export default TicketBody;
