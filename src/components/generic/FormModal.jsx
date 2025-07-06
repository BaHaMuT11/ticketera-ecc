import PropTypes from "prop-types";

const FormModal = (props) => {

    return (
        <>
            {props.show && (
                <>
                    <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">{props.title}</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        aria-label="Cerrar"
                                        onClick={() => props.setShow(false)}
                                    ></button>
                                </div>
                                {props.formComponent}
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </>
    );
};

FormModal.propTypes = {
    show: PropTypes.bool.isRequired,
    setShow: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    formComponent: PropTypes.element.isRequired
}

export default FormModal;
