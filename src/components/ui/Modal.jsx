import {useEffect} from "react";
import PropTypes from "prop-types";
import {X} from "lucide-react";

export const Modal = ({open, onClose, title, children}) => {
    useEffect(() => {
        if (!open) return;
        const alPresionar = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", alPresionar);
        return () => window.removeEventListener("keydown", alPresionar);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
            <div className="absolute inset-0 bg-black/55" onClick={onClose} aria-hidden="true"></div>
            <div role="dialog" aria-modal="true" aria-labelledby="modal-titulo"
                 className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-surface shadow-2xl">
                <div className="flex items-center justify-between border-b border-line px-6 py-4">
                    <h2 id="modal-titulo" className="text-lg font-semibold tracking-tight">{title}</h2>
                    <button type="button" aria-label="Cerrar" onClick={onClose}
                            className="grid size-8 place-items-center rounded-lg text-ink-3 hover:bg-surface-2 hover:text-ink">
                        <X className="size-4" aria-hidden="true"/>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

Modal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node
};
