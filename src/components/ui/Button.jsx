import PropTypes from "prop-types";

const VARIANTES = {
    primary: "bg-brand text-brand-ink font-semibold hover:brightness-110",
    ghost: "border border-line bg-surface text-ink font-medium hover:bg-surface-2",
    danger: "border border-danger/40 bg-danger-soft text-danger font-semibold hover:brightness-95"
};

const TAMANOS = {
    lg: "h-11 px-5",
    sm: "h-9 px-3.5 text-sm"
};

export const Button = ({variant = "primary", size = "lg", icon: Icon, full = false, className = "", type = "button", children, ...props}) => (
    <button
        type={type}
        className={`inline-flex items-center justify-center gap-2 rounded-lg transition-[filter,background-color] disabled:cursor-not-allowed disabled:opacity-50 ${TAMANOS[size]} ${VARIANTES[variant]} ${full ? "w-full" : ""} ${className}`}
        {...props}>
        {Icon && <Icon className="size-4 shrink-0" aria-hidden="true"/>}
        {children}
    </button>
);

Button.propTypes = {
    variant: PropTypes.oneOf(["primary", "ghost", "danger"]),
    size: PropTypes.oneOf(["lg", "sm"]),
    icon: PropTypes.elementType,
    full: PropTypes.bool,
    className: PropTypes.string,
    type: PropTypes.string,
    children: PropTypes.node
};
