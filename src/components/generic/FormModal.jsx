import PropTypes from "prop-types";
import {Modal} from "../ui/Modal.jsx";

const FormModal = (props) => (
    <Modal open={props.show} onClose={() => props.setShow(false)} title={props.title}>
        {props.formComponent}
    </Modal>
);

FormModal.propTypes = {
    show: PropTypes.bool.isRequired,
    setShow: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    formComponent: PropTypes.element
}

export default FormModal;
