import PropTypes from "prop-types";
import {ChevronDown} from "lucide-react";

const BASE = "w-full rounded-lg border border-line bg-surface-2 px-3 text-[15px] text-ink placeholder:text-ink-3 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

/** Etiqueta + control + ayuda. "extra" va junto a la etiqueta (por ejemplo, un selector segmentado). */
export const Field = ({label, htmlFor, extra, hint, hintTone = "neutral", className = "", children}) => (
    <div className={className}>
        <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <label htmlFor={htmlFor} className="text-sm font-medium text-ink-2">{label}</label>
            {extra}
        </div>
        {children}
        {hint && <p className={`mt-1.5 text-[13px] ${hintTone === "ok" ? "text-ok" : "text-ink-3"}`}>{hint}</p>}
    </div>
);

Field.propTypes = {
    label: PropTypes.node.isRequired,
    htmlFor: PropTypes.string,
    extra: PropTypes.node,
    hint: PropTypes.node,
    hintTone: PropTypes.oneOf(["neutral", "ok"]),
    className: PropTypes.string,
    children: PropTypes.node
};

export const Input = ({mono = false, className = "", ...props}) => (
    <input className={`h-10 ${BASE} ${mono ? "font-mono text-[14px]" : ""} ${className}`} {...props}/>
);

Input.propTypes = {
    mono: PropTypes.bool,
    className: PropTypes.string
};

export const Textarea = ({className = "", ...props}) => (
    <textarea className={`${BASE} py-2.5 leading-6 ${className}`} {...props}/>
);

Textarea.propTypes = {
    className: PropTypes.string
};

export const Select = ({className = "", children, ...props}) => (
    <div className="relative">
        <select className={`h-10 appearance-none pr-9 ${BASE} ${className}`} {...props}>{children}</select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-3" aria-hidden="true"/>
    </div>
);

Select.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
};
