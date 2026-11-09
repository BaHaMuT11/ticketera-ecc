import PropTypes from "prop-types";

const TONOS = {
    ok: "bg-ok-soft text-ok",
    brand: "bg-brand-soft text-brand",
    warn: "bg-warn-soft text-warn",
    mute: "border border-line bg-surface-2 text-ink-2"
};

export const Chip = ({tone = "mute", children}) => (
    <span className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[13px] font-medium ${TONOS[tone]}`}>
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true"/>
        {children}
    </span>
);

Chip.propTypes = {
    tone: PropTypes.oneOf(["ok", "brand", "warn", "mute"]),
    children: PropTypes.node
};
