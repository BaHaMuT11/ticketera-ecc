import PropTypes from "prop-types";

const Modal = (props) => {

    return (
        <>
            {props.show && (
                <>
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Título del Modal</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Cerrar"
                                        onClick={() => props.setShow(false)}
                                    ></button>
                                </div>
                                <div className="modal-body">
                                    <p>Este es el contenido del modal.</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => props.setShow(false)}
                                    >
                                        Cerrar
                                    </button>
                                    <button type="button" className="btn btn-primary">
                                        Guardar cambios
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </>
    );
};

Modal.propTypes = {
    show: PropTypes.bool.isRequired,
    setShow: PropTypes.func.isRequired
}

export default Modal;
