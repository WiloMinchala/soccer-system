// const { act } = require("react");
const API = '/api/';
function iconBtn(icon, id)
{
    return `
        <button class="btn-action edit" data-id="${id}">✏️</button>
        <button class="btn-action delete" data-id="${id}">🗑️</button>`;
}

async function fetchAPI(endpoint)
{
    const res = await fetch(API + endpoint);
    return await res.json();
}

function render(container, columns, data)
{
    const el = document.getElementById(container);
    if (!el) return;
    let html = `
    <div class="card">
    <table class="table">
    <thead>
    <tr>
    `;

    columns.forEach(c =>
        html += `<th>${c.label}</th>`
    );

    html += '<th>Acciones</th>';

    html += '</tr></thead><tbody>';

    data.forEach(row =>
    {

        html += '<tr>';

        columns.forEach(c =>
            html += `<td>${row[c.key]}</td>`
        );

        html += `<td>${iconBtn('', row.id)}</td>`;

        html += '</tr>';

    });

    html += '</tbody></table></div>';

    el.innerHTML = html;

}


async function loadCategorias()
{

    const data = await fetchAPI('categorias');

    render(

        'tabla-categorias',

        [
            { key:'id',label:'ID'},
            { key:'nombre',label:'Nombre'},
            { key:'color',label:'Color'}
        ],

        data

    );

}


async function loadEquipos()
{

    const data = await fetchAPI('equipos');

    render(

        'tabla-equipos',

        [
            { key:'id',label:'ID'},
            { key:'nombre',label:'Nombre'},
            { key:'categoria_id',label:'Categoria'},
            { key:'costo_inscripcion',label:'Costo'}
        ],

        data

    );

}


async function loadEncuentros()
{

    const data = await fetchAPI('encuentros');

    render(

        'tabla-encuentros',

        [
            { key:'id',label:'ID'},
            { key:'fecha',label:'Fecha'},
            { key:'goles_local',label:'GL'},
            { key:'goles_visitante',label:'GV'},
            { key:'finalizado',label:'Final'}
        ],

        data

    );

}


async function loadJugadores()
{

    const data = await fetchAPI('jugadores');

    render(

        'tabla-jugadores',

        [
            { key:'id',label:'ID'},
            { key:'cedula',label:'Cedula'},
            { key:'nombres',label:'Nombres'},
            { key:'apellidos',label:'Apellidos'}
        ],

        data

    );

}


async function loadParticipaciones()
{

    const data = await fetchAPI('participaciones');

    render(

        'tabla-participaciones',

        [
            { key:'id',label:'ID'},
            { key:'jugador_id',label:'Jugador'},
            { key:'goles',label:'Goles'},
            { key:'tarjeta_roja',label:'Roja'}
        ],

        data

    );

}


async function loadPosiciones()
{

    const data = await fetchAPI('posiciones');

    render(

        'tabla-posiciones',

        [
            { key:'equipo_id',label:'Equipo'},
            { key:'puntos',label:'Puntos'},
            { key:'diferencia_goles',label:'DG'}
        ],

        data

    );

}


document.addEventListener('DOMContentLoaded', () =>
{

    loadCategorias();

    loadEquipos();

    loadEncuentros();

    loadJugadores();

    loadParticipaciones();

    loadPosiciones();

});

// API helper
async function api(endpoint, method='GET', data=null)
{

    const res = await fetch('/api/' + endpoint, {

        method,

        headers:{
            'Content-Type':'application/json'
        },

        body:data ? JSON.stringify(data) : null

    });

    return await res.json();

}

// Modal control
function openModal(data=null)
{

    document.getElementById('modal').classList.remove('hidden');

    if(data)
    {

        id.value=data.id;
        nombre.value=data.nombre;
        color.value=data.color;

    }
    else
    {

        id.value='';
        nombre.value='';
        color.value='#000000';

    }

}

function closeModal()
{

    modal.classList.add('hidden');

}

// CREATE + UPDATE
async function saveCategoria()
{

    const data = {

        id:id.value,
        nombre:nombre.value,
        color:color.value

    };

    if(data.id)
    {

        await api('categorias','PUT',data);

    }
    else
    {

        await api('categorias','POST',data);

    }

    closeModal();

    loadCategorias();

}
// DELETE
async function deleteCategoria(id)
{

    if(!confirm('Eliminar categoria?')) return;

    await api('categorias','DELETE',{id});

    loadCategorias();

}

// Actualizar render con botones
async function loadCategorias()
{

    const data = await api('categorias');

    const container=document.getElementById('tabla-categorias');

    let html=`

    <button onclick="openModal()" class="btn">
    ➕ Nueva Categoria
    </button>

    <table class="table">

    <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Color</th>
        <th></th>
    </tr>
    `;

    data.forEach(row=>{

        html+=`
        <tr>

            <td>${row.id}</td>

            <td>${row.nombre}</td>

            <td>
                <div style="
                width:20px;
                height:20px;
                background:${row.color}">
                </div>
            </td>

            <td>

                <button onclick='openModal(${JSON.stringify(row)})'>
                ✏️
                </button>

                <button onclick='deleteCategoria(${row.id})'>
                🗑️
                </button>

            </td>

        </tr>
        `;

    });

    html+='</table>';

    container.innerHTML=html;

}
