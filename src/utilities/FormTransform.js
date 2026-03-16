
export const formTransform = (value) => {
    return typeof value === "string" ? value.trim().toUpperCase() : value;
};

export function limpiarRegion(regionTexto) {
    if (!regionTexto) return "";

    // Expresión regular para quitar números, puntos y guiones al inicio (ej: "06.- ")
    return regionTexto
        .replace(/^\d{2}\.-\s*/, "")
        .toUpperCase()
        .trim();
}

export function traducirOficina(ofiTexto) {
    if (!ofiTexto) return "";

    // Definición interna de capitales regionales
    const capitales = {
        "TARAPACÁ": "IQUIQUE",
        "ANTOFAGASTA": "ANTOFAGASTA",
        "ATACAMA": "COPIAPÓ",
        "COQUIMBO": "LA SERENA",
        "VALPARAÍSO": "VALPARAÍSO",
        "O'HIGGINS": "RANCAGUA",
        "O´HIGGINS": "RANCAGUA", // Variación de tilde
        "MAULE": "TALCA",
        "BIOBÍO": "CONCEPCIÓN",
        "BIO-BÍO": "CONCEPCIÓN",
        "ARAUCANÍA": "TEMUCO",
        "LOS LAGOS": "PUERTO MONTT",
        "AYSÉN": "COYHAIQUE",
        "MAGALLANES": "PUNTA ARENAS",
        "METROPOLITANA": "SANTIAGO",
        "SANTIAGO": "SANTIAGO",      // Caso común en el Excel
        "LOS RÍOS": "VALDIVIA",
        "ARICA Y PARINACOTA": "ARICA",
        "ARICA": "ARICA",
        "ÑUBLE": "CHILLÁN"
    };

    // Traducciones específicas (Excepciones)
    const excepciones = {
        "CEI BICENTENARIO": "CENTRO ESPECIALIZADO DE IDENTIFICACION BICENTENARIO",
        "CMI ESTACIÓN CENTRAL": "CENTRO DE IDENTIFICACION ALAMEDA",
        "CMI ESTACION CENTRAL": "CENTRO DE IDENTIFICACION ALAMEDA"
    };

    let textoUpper = ofiTexto.toUpperCase().trim();

    // Caso 1: Revisar si es una excepción directa
    if (excepciones[textoUpper]) {
        return excepciones[textoUpper];
    }

    // Caso 2: Si es "Atención Terreno...", buscar la capital
    if (textoUpper.includes("ATENCIÓN TERRENO") || textoUpper.includes("ATENCION TERRENO")) {
        // Extraer solo el nombre de la región (lo que viene después de "TERRENO ")
        let regionExtraida = textoUpper.split(/TERRENO\s+/)[1];

        if (regionExtraida && capitales[regionExtraida]) {
            return `DIRECCIÓN REGIONAL ${capitales[regionExtraida]}`;
        }
    }

    // Caso 3: Si no coincide con nada, devolver el texto original en MAYÚSCULAS
    return textoUpper;
}

