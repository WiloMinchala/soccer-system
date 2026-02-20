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
        clock.innerHTML = now.toLocaleTimeString() + '<br>' + now.toLocaleDateString();
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
    // participaciones: [],
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
function renderTable(containerId, columns, data, options = {})
{
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!Array.isArray(data)) data = [];
    const state =
    {
        page: 1,
        perPage: options.perPage || 10,
        search: '',
        sortKey: null,
        sortDir: 'asc'
    };
    function filterData()
    {
        let filtered = [...data];
        // SEARCH
        if (state.search)
        {
            filtered = filtered.filter(row =>
                Object.values(row)
                .some(val =>
                    String(val)
                    .toLowerCase()
                    .includes(state.search)
                )
            );
        }
        // SORT
        if (state.sortKey)
        {
            filtered.sort((a,b)=>
            {
                let v1 = a[state.sortKey];
                let v2 = b[state.sortKey];
                if (v1 < v2) return state.sortDir==='asc'? -1 : 1;
                if (v1 > v2) return state.sortDir==='asc'? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }

    function paginateData(filtered)
    {
        const start = (state.page - 1) * state.perPage;
        return filtered.slice(start, start + state.perPage);
    }

    function render()
    {
        const filtered = filterData();
        const paginated = paginateData(filtered);
        const totalPages = Math.ceil(filtered.length / state.perPage);

        let html = `
        <div class="card">
            <div class="table-header">
                <input
                    type="text"
                    placeholder="Buscar..."
                    class="table-search"
                    id="table-search"
                >

            </div>
            <div class="table-container">
            <table class="table">
            <thead>
            <tr>
        `;

        columns.forEach(col =>
        {
            html += `
            <th class="${col.align==='center'?'text-center':''}"
                data-sort="${col.key}"
                style="cursor:pointer"
            >
                ${escapeHtml(col.label)}
            </th>`;
        });

        html += `</tr></thead><tbody>`;

        if (paginated.length === 0)
        {
            html += `
            <tr>
                <td colspan="${columns.length}"
                class="text-center">
                Sin datos
                </td>
            </tr>`;
        }

        paginated.forEach(row =>
        {
            html += `<tr>`;
            columns.forEach(col =>
            {
                html += renderCell(col, row);
            });
            html += `</tr>`;
        });
        html += `
        </tbody>
        </table>
        </div>

        ${renderPagination(state.page, totalPages)}
        </div>
        `;
        container.innerHTML = html;
        bindEvents(totalPages);
    }

    function renderCell(col, row)
    {
        let value = row[col.key];
        let align =
            col.align === 'center'
            ? 'text-center'
            : '';
        // STATUS
        if (col.type === 'status')
        {
            const active =
                value == 1 ||
                value == 'activo';
            return `
            <td class="text-center">
                <span class="
                badge
                ${active?'badge-active':'badge-inactive'}">
                ${active?'Activo':'Inactivo'}

                </span>

            </td>`;
        }
        // ACTIONS
        if (col.type === 'actions')
        {
            return `
            <td class="text-center">

                <button
                class="btn-action edit"
                onclick="editRow(${row.id})">
                ✏️
                </button>

                <button
                class="btn-action delete"
                onclick="deleteRow(${row.id})">
                🗑️
                </button>

            </td>`;
        }
        return `
        <td class="${align}">
            ${escapeHtml(value ?? '')}
        </td>`;
    }

    function renderPagination(page, totalPages)
    {
        if (totalPages <= 1) return '';
        return `
        <div class="pagination">
            <button
            ${page==1?'disabled':''}
            onclick="changePage(${page-1})">
            Anterior
            </button>
            <span>
            Página ${page} de ${totalPages}
            </span>
            <button
            ${page==totalPages?'disabled':''}
            onclick="changePage(${page+1})">
            Siguiente
            </button>

        </div>
        `;
    }

    function bindEvents(totalPages)
    {
        document
        .getElementById('table-search')
        .addEventListener('input', e =>
        {
            state.search =
                e.target.value.toLowerCase();

            state.page = 1;

            render();
        });

        document
        .querySelectorAll('[data-sort]')
        .forEach(th =>
        {
            th.onclick = () =>
            {
                const key = th.dataset.sort;

                if (state.sortKey === key)
                {
                    state.sortDir =
                        state.sortDir === 'asc'
                        ? 'desc'
                        : 'asc';
                }
                else
                {
                    state.sortKey = key;
                    state.sortDir = 'asc';
                }

                render();
            };
        });

        window.changePage = function(p)
        {
            if (p < 1 || p > totalPages) return;

            state.page = p;

            render();
        }
    }

    render();
}
/* ==========================================================
   MODULOS
========================================================== */
async function loadCategorias()
{
    const container = document.getElementById('tabla-categorias');
    if (!container) return;
    state.categorias = await apiFetch('categorias');
    renderTable(
        'tabla-categorias',
        [
            { key: 'id_categoria', label: 'ID', align:'center'},
            { key: 'nombre', label: 'Nombre' },
            { key: 'descripcion', label: 'Descripción'},
            { key: 'color', label: 'Color', align:'center'},
            { key: 'costo_inscripcion', label: 'Costo Inscripción', align:'center'},
            { key: 'estado', label: 'Estado', align:'center', type:'status'},
            { key: 'id_categoria', label: 'Acciones', type: 'actions'}
        ],
        state.categorias,
        { perPage: 13 }
    );
}

async function loadEquipos()
{
    const container = document.getElementById('tabla-equipos');
    if (!container) return;
    state.equipos = await apiFetch('equipos');
    renderTable(
        'tabla-equipos',
        [
            { key: 'id_equipo', label: 'ID', align: 'center'},
            { key: 'nombre_equipo', label: 'Nombre Equipo'},
            { key: 'nombre_categoria', label: 'Categoria'},
            { key: 'pago_inscripcion', label: 'Pago Inscripción', align: 'center'},
            { key: 'costo_inscripcion', label: 'Costo Inscripción', align: 'center'},
            { key: 'estado', label: 'Estado', align:'center', type:'status'},
            { key: 'id_equipo', label: 'Acciones', align: 'center', type: 'actions'}
        ],
        state.equipos,
        { perPage: 13 }
    );
}

async function loadJugadores()
{
    const container = document.getElementById('tabla-jugadores');
    if (!container) return;
    state.jugadores = await apiFetch('jugadores');
    renderTable(
        'tabla-jugadores',
        [
            { key: 'id_jugador', label: 'ID', align: 'center' },
            { key: 'cedula', label: 'Cedula', align: 'center' },
            { key: 'nombres', label: 'Nombres Jugador' },
            { key: 'apellidos', label: 'Apellidos Jugador' },
            { key: 'numero_camiseta', label: 'Numero Camiseta', align: 'center' },
            { key: 'equipo_id', label: 'ID Equipo', align: 'center' },
            { key: 'nombre_equipo', label: 'Nombre Equipo' },
            { key: 'categoria_id', label: 'ID Categoria', align: 'center'},
            { key: 'nombre_categoria', label: 'Nombre Categoria' },
            { key: 'estado', label: 'Estado', align:'center', type:'status'},
            { key: 'id_jugador', label: 'Acciones', align: 'center', type: 'actions'}
        ],
        state.jugadores,
        { perPage: 13 }
    );
}

async function loadEncuentros()
{
    const container = document.getElementById('tabla-encuentros');
    if (!container) return;
    state.encuentros = await apiFetch('encuentros');
    renderTable(
        'tabla-encuentros',
        [
            { key: 'id_encuentro', label: 'ID', align: 'center' },
            { key: 'equipo_local', label: 'Equipo Local' },
            { key: 'goles_local', label: 'GL', align: 'center' },
            { key: 'equipo_visitante', label: 'Equipo Visitante' },
            { key: 'goles_visitante', label: 'GV', align: 'center' },
            { key: 'fecha_hora_encuentro', label: 'Fecha Partido' },
            { key: 'nombre_categoria', label: 'Categoria' },
            { key: 'finalizado', label: 'Finalizado', align: 'center' },
            { key: 'pago_arbitraje_local', label: 'Pago Arbitraje Local' },
            { key: 'pago_arbitraje_visitante', label: 'Pago Arbitraje Visitante' },
            { key: 'estado', label: 'Estado', align:'center', type:'status'},
            { key: 'id_encuentro', label: 'Acciones', align: 'center', type: 'actions'}
        ],
        state.encuentros,
        { perPage: 13 }
    );
}

async function loadPosiciones()
{
    const container = document.getElementById('tabla-posiciones');
    if (!container) return;
    state.posiciones = await apiFetch('posiciones');
    renderTable(
       'tabla-posiciones',
       [
        { key: 'id', label: 'ID', align: 'center' },
        { key: 'nombre_categoria', label: 'Categoría' },
        { key: 'equipo_nombre', label: 'Equipo' }, 
        { key: 'partidos_jugados', label: 'PJ', align: 'center' }, // Partidos Jugados
        { key: 'partidos_ganados', label: 'PG', align: 'center' }, // Partidos Ganados
        { key: 'partidos_empatados', label: 'PE', align: 'center' }, // Partidos Empatados
        { key: 'partidos_perdidos', label: 'PP', align: 'center' }, // Partidos Perdidos
        { key: 'goles_a_favor', label: 'GF', align: 'center' }, // Goles a Favor
        { key: 'goles_en_contra', label: 'GC', align: 'center' }, // Goles en Contra
        { key: 'diferencia_goles', label: 'DG', align: 'center' }, // Diferencia de Goles
        { key: 'puntos', label: 'Puntos', align: 'center' }, // Puntos
        { key: 'estado', label: 'Estado', align:'center', type:'status'},
        { key: 'id', label: 'Acciones', align: 'center', type: 'actions'}
       ],
        state.posiciones,
        { perPage: 13 }
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

function editRow(id)
{
    console.log("Editar:", id);
}

function deleteRow(id)
{
    if (!confirm("Eliminar registro?")) return;
    console.log("Eliminar:", id);
}
