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
    posiciones: [],
    tarjetas: [],
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

        const response = await fetch(url,
        {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });

        if (!response.ok)
        {
            return {
                error: true,
                type: 'http',
                status: response.status,
                message: `Error HTTP ${response.status}`
            };
        }

        const text = await response.text();

        try
        {
            const json = JSON.parse(text);

            if (json.error)
            {
                return {
                    error: true,
                    type: 'server',
                    message: json.error
                };
            }

            return {
                error: false,
                data: json
            };
        }
        catch
        {
            return {
                error: true,
                type: 'format',
                message: 'Respuesta no es JSON válido'
            };
        }
    }
    catch(error)
    {
        return {
            error: true,
            type: 'network',
            message: 'Error de conexión al servidor'
        };
    }
}
/* ==========================================================
   RENDER TABLA GENERICA
========================================================== */
function renderTable(containerId, columns, result, options = {})
{
    const container = document.getElementById(containerId);

    if (!container)
    {
        console.warn("Contenedor no encontrado:", containerId);
        return;
    }

    /*
    |--------------------------------------------------------------------------
    | 1. MANEJO DE ERROR API
    |--------------------------------------------------------------------------
    */

    if (result?.error)
    {
        let message = '';

        switch(result.type)
        {
            case 'network':
                message = '❌ Sin conexión al servidor';
                break;

            case 'http':
                message = `❌ Error HTTP ${result.status}`;
                break;

            case 'server':
                message = `❌ Error del servidor: ${result.message}`;
                break;

            case 'format':
                message = '❌ Respuesta inválida del servidor';
                break;

            default:
                message = '❌ Error desconocido';
        }

        container.innerHTML =
        `
        <div class="card text-center" style="color:#dc2626;font-weight:600;">
            ${message}
        </div>
        `;

        return;
    }

    /*
    |--------------------------------------------------------------------------
    | 2. SIN REGISTROS
    |--------------------------------------------------------------------------
    */

    const data = result.data;

    if (!Array.isArray(data) || data.length === 0)
    {
        container.innerHTML =
        `
        <div class="card text-center">
            ℹ️ No existen registros
        </div>
        `;
        return;
    }

    /*
    |--------------------------------------------------------------------------
    | 3. RENDER TABLA NORMAL
    |--------------------------------------------------------------------------
    */

    let html =
    `
    <div class="card table-container">
    <table class="table">
    <thead>
    <tr>
    `;

    columns.forEach(col =>
    {
        const align =
            col.align === 'center'
            ? 'text-center'
            : '';

        html +=
        `
        <th class="${align}">
            ${escapeHtml(col.label)}
        </th>
        `;
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
            const align =
                col.align === 'center'
                ? 'text-center'
                : '';

            let value = row[col.key];

            // if (col.render)
            // {
            //     value = col.render(value, row);
            // }
            // else
            // {
            //     value = escapeHtml(value);
            // }
            if (col.type === 'status')
{
    value = row[col.key] == 1
        ? '<span class="badge-active">Activo</span>'
        : '<span class="badge-inactive">Inactivo</span>';
}
else if (col.type === 'actions')
{
    value = `
        <button class="btn-action edit" onclick="editRow(${row[col.key]})">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn-action delete" onclick="deleteRow(${row[col.key]})">
            <i class="fas fa-trash"></i>
        </button>
    `;
}
else if (col.render)
{
    value = col.render(value, row);
}
else
{
    value = escapeHtml(value);
}


            html +=
            `
            <td class="${align}">
                ${value}
            </td>
            `;
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

    if (!container)
    {
        console.warn("Contenedor tabla-posiciones no existe");
        return;
    }

    const result = await apiFetch('posiciones_api');

    renderTable(
       'tabla-posiciones',
       [
        { key: 'id', label: 'ID', align: 'center' },
        { key: 'nombre_categoria', label: 'Categoría' },
        { key: 'equipo_nombre', label: 'Equipo' }, 
        { key: 'partidos_jugados', label: 'PJ', align: 'center' },
        { key: 'partidos_ganados', label: 'PG', align: 'center' },
        { key: 'partidos_empatados', label: 'PE', align: 'center' },
        { key: 'partidos_perdidos', label: 'PP', align: 'center' },
        { key: 'goles_a_favor', label: 'GF', align: 'center' },
        { key: 'goles_en_contra', label: 'GC', align: 'center' },
        { key: 'diferencia_goles', label: 'DG', align: 'center' },
        { key: 'puntos', label: 'Puntos', align: 'center' },
        { key: 'estado', label: 'Estado', align:'center', type:'status'},
        { key: 'id', label: 'Acciones', align: 'center', type: 'actions'}
       ],
        result
    );

    if (!result.error)
    {
        state.posiciones = result.data;
    }
}

async function loadTarjetas()
{
    const container = document.getElementById('tabla-tarjetas');

    if (!container)
    {
        console.warn("Contenedor tabla-tarjetas no existe");
        return;
    }

    const result = await apiFetch('tarjetas_api');

    renderTable(
       'tabla-tarjetas',
       [
        { key: 'id', label: 'ID', align: 'center' },
        { key: 'jugador', label: 'Jugador' },
        { key: 'equipo', label: 'Equipo' }, 
        { key: 'encuentro', label: 'Encuentro' },
        { key: 'fecha', label: 'Fecha' },
        { key: 'tipo_tarjeta', label: 'Tipo Tarjeta' },
        { key: 'pagada', label: 'Pagada', align:'center'},
        { key: 'estado', label: 'Estado', align:'center', type:'status'},
        { key: 'id', label: 'Acciones', align: 'center', type: 'actions'}
       ],
        result
    );

    if (!result.error)
    {
        state.tarjetas = result.data;
    }
}
async function loadResultados()
{
    const container = document.getElementById('tabla-resultados');

    if (!container)
    {
        console.warn("Contenedor tabla-resultados no existe");
        return;
    }

    const result = await apiFetch('resultados_api');

    renderTable(
       'tabla-resultados',
       [
        { key: 'fecha', label: 'Fecha', align: 'center' },
        { key: 'equipo_local', label: 'Equipo Local' }, 
        { key: 'resultado', label: 'Resultado' },
        { key: 'equipo_visitante', label: 'Equipo Visitante' }, 
        { key: 'pago_arbitraje_local', label: 'Pago Arbitraje L' }, 
        { key: 'pago_arbitraje_visitante', label: 'Pago Arbitraje V' },
        { key: 'estado', label: 'Estado', align:'center', type:'status'},
        { key: 'id', label: 'Acciones', align: 'center', type: 'actions'}
       ],
        result
    );

    if (!result.error)
    {
        state.resultados = result.data;
    }
}
async function loadGoleadoresGeneral()
{
    const container = document.getElementById('tabla-goleadores-general');

    if (!container)
    {
        console.warn("Contenedor tabla-goleadores-general no existe");
        return;
    }

    const result = await apiFetch('goleadores_general_api');

    renderTable(
       'tabla-goleadores-general',
       [
        { key: 'nombre_categoria', label: 'Categoria' },
        { key: 'jugador', label: 'Jugador' }, 
        { key: 'equipo', label: 'Equipo' },
        { key: 'total_goles', label: 'Total Goles' },
        // { key: 'estado', label: 'Estado', align:'center', type:'status'},
        { key: 'id', label: 'Acciones', align: 'center', type: 'actions'}
       ],
        result
    );

    if (!result.error)
    {
        state.goleadores_general = result.data;
    }
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
    loadPosiciones();
    loadTarjetas();
    loadResultados();
    loadGoleadoresGeneral();
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
