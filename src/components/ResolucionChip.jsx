import PropTypes from "prop-types";
import {Chip} from "./ui/Chip.jsx";
import {resolucionNormalizada} from "../utilities/Atencion.js";

const ResolucionChip = ({resolucion}) => {
    const normalizada = resolucionNormalizada(resolucion);
    if (normalizada === "RESUELTO") return <Chip tone="ok">Resuelto en N1</Chip>;
    if (normalizada === "N2") return <Chip tone="brand">Derivado a N2</Chip>;
    if (normalizada === "N3") return <Chip tone="warn">Derivado a N3</Chip>;
    return <Chip>{normalizada}</Chip>;
};

ResolucionChip.propTypes = {
    resolucion: PropTypes.string
};

export default ResolucionChip;
