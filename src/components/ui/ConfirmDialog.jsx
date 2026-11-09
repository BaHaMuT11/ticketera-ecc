import PropTypes from "prop-types";
import {Modal} from "./Modal.jsx";
import {Button} from "./Button.jsx";

/** Confirmación para acciones que borran datos. */
export const ConfirmDialog = ({open, title, description, confirmLabel, cancelLabel = "Volver", danger = false, onConfirm, onCancel}) => (
    <Modal open={open} onClose={onCancel} title={title}>
        <p className="px-6 py-5 text-[15px] leading-6 text-ink-2">{description}</p>
        <div className="flex justify-end gap-3 border-t border-line px-6 py-4">
            <Button variant="ghost" onClick={onCancel} autoFocus>{cancelLabel}</Button>
            <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
    </Modal>
);

ConfirmDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.node.isRequired,
    confirmLabel: PropTypes.string.isRequired,
    cancelLabel: PropTypes.string,
    danger: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};
