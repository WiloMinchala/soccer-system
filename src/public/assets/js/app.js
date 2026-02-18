/* ==========================================================
   RELOJ
========================================================== */
function startClock()
{
    const clock = document.getElementById('clock');
    if (!clock) return;
    function updateClock()
    {
        const now = new Date();
        clock.innerHTML =
            now.toLocaleTimeString() +
            '<br>' +
            now.toLocaleDateString();
    }
    updateClock();
    setInterval(updateClock, 1000);
}

/* ==========================================================
   CONFIGURACIÓN BASE
========================================================== */
const API_BASE = '/api';

const state =
{
    categorias: [],
    equipos: [],
    jugadores: [],
    encuentros: [],
    participaciones: [],
    posiciones: [],
    reportes: [],
    goleadores_general: [],
    resultados: []
};

/* ==========================================================
   FETCH GENERICO PROFESIONAL
========================================================== */
async function apiFetch(endpoint)
{
    try
    {
        const url = `${API_BASE}/${endpoint}.php`;
        console.log("Fetching:", url);
        const response = await fetch(url,
        {
            method: 'GET',
            headers:
            {
                'Accept': 'application/json'
            }
        });
        if (!response.ok)
        {
            throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        try
        {
            return JSON.parse(text);
        }
        catch
        {
            console.error("La API no devolvió JSON válido:", text);
            return [];
        }
    }
    catch(error)
    {
        console.error("Error en apiFetch:", error);
        return [];
    }
}

/* ==========================================================
   RENDER TABLA GENERICA
========================================================== */

function renderTable(containerId, columns, data)
{
    const container =
        document.getElementById(containerId);
    if (!container)
    {
        console.warn("Contenedor no encontrado:", containerId);
        return;
    }
    if (!Array.isArray(data) || data.length === 0)
    {
        container.innerHTML =
            `<div class="card">Sin datos</div>`;
        return;
    }
    let html =
    `
    <div class="card">
    <table class="table">
    <thead>
    <tr>
    `;
    columns.forEach(col =>
    {
        html += `<th>${escapeHtml(col.label)}</th>`;
    });
    html +=
    `
    </tr>
    </thead>
    <tbody>
    `;
    data.forEach(row =>
    {
        html += `<tr>`;
        columns.forEach(col =>
        {
            html += `<td>${escapeHtml(row[col.key])}</td>`;
        });
        html += `</tr>`;
    });
    html +=
    `
    </tbody>
    </table>
    </div>
    `;
    container.innerHTML = html;
}

/* ==========================================================
   MODULOS
========================================================== */
async function loadCategorias()
{
    const container =
        document.getElementById('tabla-categorias');
    if (!container) return;
    state.categorias =
        await apiFetch('categorias');
    renderTable(
        'tabla-categorias',
        [
            { key: 'id', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'descripcion', label: 'Descripción' },
            { key: 'color', label: 'Color' },
            { key: 'costo_inscripcion', label: 'Costo Inscripción' },
            { key: 'estado', label: 'Estado' }
        ],
        state.categorias
    );
}


async function loadEquipos()
{
    const container =
        document.getElementById('tabla-equipos');
    if (!container) return;
    state.equipos =
        await apiFetch('equipos');
    renderTable(
        'tabla-equipos',
        [
            { key: 'id_equipo', label: 'ID' },
            { key: 'nombre_equipo', label: 'Nombre Equipo' },
            { key: 'costo_inscripcion', label: 'Pago Inscripción' },
            { key: 'categoria_id', label: 'Categoria' },
            { key: 'nombre_categoria', label: 'Nombre Categoria' },
            { key: 'costo_inscripcion', label: 'Costo Inscripción' }
        ],
        state.equipos
    );
}

async function loadJugadores()
{
    const container =
        document.getElementById('tabla-jugadores');

    if (!container) return;

    state.jugadores =
        await apiFetch('jugadores');

    renderTable(
        'tabla-jugadores',
        [
            { key: 'id_jugador', label: 'ID' },
            { key: 'cedula', label: 'Cedula' },
            { key: 'nombres', label: 'Nombres Jugador' },
            { key: 'apellidos', label: 'Apellidos Jugador' },
            { key: 'numero_camiseta', label: 'Numero' },
            { key: 'equipo_id', label: 'ID Equipo' },
            { key: 'nombre_equipo', label: 'Nombre Equipo' },
            { key: 'categoria_id', label: 'ID Categoria' },
            { key: 'nombre_categoria', label: 'Nombre Categoria' }
        ],
        state.jugadores
    );
}


async function loadEncuentros()
{
    const container =
        document.getElementById('tabla-encuentros');
    if (!container) return;
    state.encuentros =
        await apiFetch('encuentros');
    renderTable(
        'tabla-encuentros',
        [
            { key: 'id', label: 'ID' },
            { key: 'categoria_id', label: 'Categoria' },
            { key: 'equipo_local_id', label: 'Local' },
            { key: 'equipo_visitante_id', label: 'Visitante' },
            { key: 'fecha', label: 'Fecha' },
            { key: 'goles_local', label: 'GL' },
            { key: 'goles_visitante', label: 'GV' },
            { key: 'finalizado', label: 'Finalizado' }
        ],
        state.encuentros
    );
}

async function loadParticipaciones()
{
    const container =
        document.getElementById('tabla-participaciones');
    if (!container) return;
    state.participaciones =
        await apiFetch('participaciones');
    renderTable(
        'tabla-participaciones',
        [
            { key: 'id', label: 'ID' },
            { key: 'encuentro_id', label: 'Encuentro' },
            { key: 'jugador_id', label: 'Jugador' },
            { key: 'equipo_id', label: 'Equipo' },
            { key: 'goles', label: 'Goles' },
            { key: 'tarjeta_amarilla', label: 'Amarilla' },
            { key: 'tarjeta_roja', label: 'Roja' }
        ],
        state.participaciones
    );
}

async function loadPosiciones()
{
    const container =
        document.getElementById('tabla-posiciones');
    if (!container) return;
    state.posiciones =
        await apiFetch('posiciones');
    renderTable(
        'tabla-posiciones',
        [
            { key: 'equipo_id', label: 'Equipo' },
            { key: 'puntos', label: 'Puntos' },
            { key: 'partidos_jugados', label: 'PJ' },
            { key: 'partidos_ganados', label: 'PG' },
            { key: 'partidos_empatados', label: 'PE' },
            { key: 'partidos_perdidos', label: 'PP' },
            { key: 'goles_a_favor', label: 'GF' },
            { key: 'goles_en_contra', label: 'GC' },
            { key: 'diferencia_goles', label: 'DG' }
        ],
        state.posiciones
    );
}

/* ==========================================================
   INICIO
========================================================== */

document.addEventListener('DOMContentLoaded', () =>
{
    console.log("Sistema iniciado");
    startClock();
    loadCategorias();
    loadEquipos();
    loadJugadores();
    loadEncuentros();
    loadParticipaciones();
    loadPosiciones();
});

/* ==========================================================
   SEGURIDAD
========================================================== */

function escapeHtml(text)
{
    if (text === null || text === undefined)
        return '';
    return text
        .toString()
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
