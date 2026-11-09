import PropTypes from "prop-types";

/** "Boleta" con borde perforado: contenedor visual de los tickets generados. */
export const Slip = ({title, sub, action, children}) => (
    <div className="relative overflow-hidden rounded-xl border border-line bg-slip">
        <div className="flex items-start justify-between gap-3 px-5 pb-3 pt-4">
            <div className="min-w-0">
                <div className="text-[15px] font-semibold text-ink">{title}</div>
                {sub && <div className="mt-0.5 text-[13px] text-ink-3">{sub}</div>}
            </div>
            {action}
        </div>
        <div className="relative my-1 border-t-2 border-dashed border-line" aria-hidden="true">
            <span className="absolute -left-2.5 -top-[11px] size-5 rounded-full border border-line bg-bg"></span>
            <span className="absolute -right-2.5 -top-[11px] size-5 rounded-full border border-line bg-bg"></span>
        </div>
        <div className="px-5 pb-5 pt-3">{children}</div>
    </div>
);

Slip.propTypes = {
    title: PropTypes.string.isRequired,
    sub: PropTypes.node,
    action: PropTypes.node,
    children: PropTypes.node
};
