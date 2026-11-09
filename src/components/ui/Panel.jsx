import PropTypes from "prop-types";

export const Panel = ({className = "", children}) => (
    <section className={`rounded-xl border border-line bg-surface ${className}`}>{children}</section>
);

Panel.propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
};

export const PanelTitle = ({title, subtitle}) => (
    <div className="mb-4">
        <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-ink-3">{subtitle}</p>}
    </div>
);

PanelTitle.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string
};
