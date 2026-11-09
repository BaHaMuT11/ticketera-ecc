import {glosa} from "../data/glosa.js";

const normalizar = (texto) =>
    texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

// Índice calculado una sola vez: la glosa no cambia mientras corre la app.
const indice = glosa.map((item) => {
    const codigo = normalizar(item.codigo);
    const inconveniente = normalizar(item.inconveniente);
    const plantilla = normalizar(item.plantilla);
    return {
        item,
        codigo,
        inconveniente,
        plantilla,
        palabras: inconveniente.split(/[^a-z0-9]+/).filter(Boolean),
        texto: `${codigo} ${inconveniente} ${plantilla}`
    };
});

/**
 * Busca en la glosa por código (DECA001), por parte del código (deca)
 * o por palabras del inconveniente o de la plantilla. Ignora tildes y mayúsculas.
 * Todas las palabras escritas deben aparecer. Devuelve hasta "limite" resultados,
 * los más relevantes primero.
 */
export const buscarGlosa = (consulta, limite = 8) => {
    const q = normalizar(consulta ?? "");
    if (q.length < 2) return [];
    const tokens = q.split(/\s+/);

    const resultados = [];
    for (const entrada of indice) {
        if (!tokens.every((token) => entrada.texto.includes(token))) continue;

        let puntaje = 0;
        if (entrada.codigo === q) puntaje += 100;
        else if (entrada.codigo.startsWith(q)) puntaje += 80;
        if (entrada.inconveniente.startsWith(q)) puntaje += 40;
        else if (entrada.inconveniente.includes(q)) puntaje += 20;
        if (tokens.some((token) => entrada.palabras.some((palabra) => palabra.startsWith(token)))) puntaje += 10;
        if (entrada.plantilla.includes(q)) puntaje += 5;

        resultados.push({item: entrada.item, puntaje});
    }

    // sort es estable: a igual puntaje se conserva el orden de la glosa.
    return resultados
        .sort((a, b) => b.puntaje - a.puntaje)
        .slice(0, limite)
        .map((r) => r.item);
};
