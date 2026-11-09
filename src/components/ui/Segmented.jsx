import PropTypes from "prop-types";

const TRACK = "inline-flex flex-wrap gap-0.5 rounded-lg border border-line bg-surface-2 p-0.5";
const ITEM = "inline-flex items-center rounded-md text-ink-2 transition-colors";
const ITEM_ACTIVO = "bg-brand-soft font-semibold text-brand ring-1 ring-brand/30";
// Clases completas (no armadas en tiempo de ejecución) para que Tailwind las detecte.
const CHECKED = "peer-checked:bg-brand-soft peer-checked:font-semibold peer-checked:text-brand peer-checked:ring-1 peer-checked:ring-brand/30";

const tamano = (small) => (small ? "h-7 px-2.5 text-[13px]" : "h-8 px-3 text-sm");

/**
 * Grupo de radios con aspecto de selector segmentado.
 * Usa radios nativos (ocultos) para conservar la validación "required" y el teclado.
 */
export const Segmented = ({name, options, value, onChange, required = false, small = false}) => (
    <div role="radiogroup" className={TRACK}>
        {options.map((opcion) => (
            <label key={opcion.value} title={opcion.title} className="relative cursor-pointer">
                <input
                    type="radio"
                    className="peer sr-only"
                    name={name}
                    value={opcion.value}
                    checked={value === opcion.value}
                    onChange={onChange}
                    onClick={opcion.onClick}
                    required={required}
                />
                <span className={`${ITEM} ${tamano(small)} ${CHECKED} peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-brand`}>
                    {opcion.label}
                </span>
            </label>
        ))}
    </div>
);

Segmented.propTypes = {
    name: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.node.isRequired,
        title: PropTypes.string,
        onClick: PropTypes.func
    })).isRequired,
    value: PropTypes.string,
    onChange: PropTypes.func,
    required: PropTypes.bool,
    small: PropTypes.bool
};

/** Atajos que escriben un valor en otro campo (no son un campo por sí mismos). */
export const SegmentedButtons = ({options, value, onSelect, small = true}) => (
    <div className={TRACK}>
        {options.map((opcion) => (
            <button
                key={opcion.value}
                type="button"
                aria-pressed={value === opcion.value}
                onClick={() => onSelect(opcion.value)}
                className={`${ITEM} ${tamano(small)} ${value === opcion.value ? ITEM_ACTIVO : ""}`}>
                {opcion.label}
            </button>
        ))}
    </div>
);

SegmentedButtons.propTypes = {
    options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.string.isRequired,
        label: PropTypes.node.isRequired
    })).isRequired,
    value: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
    small: PropTypes.bool
};
