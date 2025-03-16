import PropTypes from "prop-types";
import {useEffect, useState} from "react";

const TicketBody = (props) => {

    const handleCopy = () => {
        navigator.clipboard.writeText(text)
            .then(() => alert("Ticket copiado al portapapeles ;)"))
            .catch((err) => console.error("Error al copiar :(", err));
    };

    const onChange = (e) => {
        setText(e.target.value);
        props.setter(e.target.value);
    }

    const[text, setText] = useState(props.text);

    useEffect(() => {
        setText(props.text);
    }, [props.text]);


    return (
        <div className="card">
            <div className="card-header text-bg-primary d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{props.title}</h5>
                <button className="btn btn-outline-light btn-sm" onClick={handleCopy}>Copiar!</button>
            </div>
            <div className="card-body">
                <textarea className="form-control" rows="15" value={text} onChange={onChange}/>
            </div>
        </div>
    );
};

TicketBody.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    setter: PropTypes.func.isRequired
}

export default TicketBody;