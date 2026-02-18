/* RELOJ */
function startClock()
    {
            const clock = document.getElementById('clock');
            if (!clock) return;
            setInterval(() => {
                const now = new Date();
                clock.innerHTML = 
                    now.toLocaleTimeString() + '<br>' + 
                    now.toLocaleDateString();
            }, 1000);
    }
/* CONFIGURACIÓN BASE */
// const API_BASE = '/api';

const API_BASE = '../api'; // ej: /api/categorias.php
const state = {

    categorias: [],
    equipos: [],
    jugadores: [],
    encuentros: [],
    participaciones: [],
    posiciones: [],
    reportes: [],
    goleadores_general: [],
    resultados: [],

};

/*  FETCH GENERICO  */
async function apiFetch(endpoint) {
    try {
        const res = await fetch(`${API_BASE}/${endpoint}.php`);
        if (!res.ok)
            throw new Error('Error API');
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}

/*
|--------------------------------------------------------------------------
| RENDER TABLA GENERICA
|--------------------------------------------------------------------------
*/

function renderTable(containerId, columns, data)
{
    const container = document.getElementById(containerId);

    if (!container) return;

    if (!data || data.length === 0)
    {
        container.innerHTML =
            `<div class="card">Sin datos</div>`;
        return;
    }

    let html = `
        <div class="card">
        <table class="table">
        <thead>
        <tr>
    `;

    columns.forEach(col =>
    {
        html += `<th>${col.label}</th>`;
    });

    html += `
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

    html += `
        </tbody>
        </table>
        </div>
    `;

    container.innerHTML = html;
}


async function loadCategorias()
{
    const container =
        document.getElementById('tabla-categorias');

    if (!container)
        return;

    state.categorias =
        await apiFetch('categorias');

    renderTable(
        'tabla-categorias',
        [
            { key: 'id', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'color', label: 'Color' }
        ],
        state.categorias
    );
}


/*
|--------------------------------------------------------------------------
| EQUIPOS
|--------------------------------------------------------------------------
*/

async function loadEquipos() {
    state.equipos = await apiFetch('equipos');
    renderTable(
        'tabla-equipos',
        [
            { key: 'id', label: 'ID' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'categoria_id', label: 'Categoria' },
            { key: 'costo_inscripcion', label: 'Costo' }
        ],
        state.equipos
    );
}

/*
|--------------------------------------------------------------------------
| ENCUENTROS
|--------------------------------------------------------------------------
*/

async function loadEncuentros() {
    state.encuentros = await apiFetch('encuentros');
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

/*
|--------------------------------------------------------------------------
| JUGADORES
|--------------------------------------------------------------------------
*/

async function loadJugadores() {
    state.jugadores = await apiFetch('jugadores');
    renderTable(
        'tabla-jugadores',
        [
            { key: 'id', label: 'ID' },
            { key: 'cedula', label: 'Cedula' },
            { key: 'nombres', label: 'Nombres' },
            { key: 'apellidos', label: 'Apellidos' },
            { key: 'numero_camiseta', label: 'Numero' },
            { key: 'equipo_id', label: 'Equipo' }
        ],
        state.jugadores
    );
}

/*
|--------------------------------------------------------------------------
| PARTICIPACIONES
|--------------------------------------------------------------------------
*/

async function loadParticipaciones() {
    state.participaciones = await apiFetch('participaciones');
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

/*
|--------------------------------------------------------------------------
| POSICIONES
|--------------------------------------------------------------------------
*/

async function loadPosiciones() {
    state.posiciones = await apiFetch('posiciones');
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

document.addEventListener('DOMContentLoaded', () =>
{
    startClock();
    if (document.getElementById('tabla-categorias'))
        loadCategorias();
    if (document.getElementById('tabla-equipos'))
        loadEquipos();
    if (document.getElementById('tabla-jugadores'))
        loadJugadores();
    if (document.getElementById('tabla-encuentros'))
        loadEncuentros();
    if (document.getElementById('tabla-participaciones'))
        loadParticipaciones();
    if (document.getElementById('tabla-posiciones'))
        loadPosiciones();
    if (document.getElementById('tabla-reportes'))
        loadReportes();
    if (document.getElementById('tabla-GoleadoresGeneral'))
        loadGoleadoresGeneral();
    if (document.getElementById('tabla-resultados'))
        loadResultados();



});

// CORRECCIÓN 5 — renderTable ES CORRECTO
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
