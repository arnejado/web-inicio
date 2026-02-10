// 1. CONSTANTES Y SELECTORES
import { misEnlaces } from './config.js';


const container = document.getElementById('links-container');
const navCategorias = document.getElementById('categorias-nav');
const inputBuscador = document.getElementById('buscador'); // <--- ¡Faltaba esto!

// 2. FUNCIONES DE RENDERIZADO
function renderizar(lista) {
    container.innerHTML = '';
    
    // Si la lista está vacía (no hay resultados)
    if (lista.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <p>No se han encontrado enlaces que coincidan con tu búsqueda...</p>
                <button onclick="resetearBusqueda()" style="background:none; border:none; color:#00adb5; cursor:pointer; text-decoration:underline;">
                    Mostrar todos los enlaces
                </button>
            </div>
        `;
        return; // Salimos de la función para no intentar hacer el forEach
    }

    // Si hay resultados, dibujamos las tarjetas como antes
    lista.forEach(sitio => {
        const nombreArchivo = sitio.nombre.toLowerCase();
        const rutaImagen = `img/${nombreArchivo}.png`;

        const anchor = document.createElement('a');
        anchor.href = sitio.url;
        anchor.className = 'card';

        anchor.target = "_blank"; 
        anchor.rel = "noopener noreferrer";

        anchor.innerHTML = `
            <div style="width: 100%; height: 120px; overflow: hidden; border-radius: 8px; margin-bottom: 12px; background: #faf7f7;">
                <img src="${rutaImagen}" alt="${sitio.nombre}" onerror="this.onerror=null; this.src='img/notfound.png';"
                style="width: 100%; height: 120px; object-fit: contain; padding: 10px; box-sizing: border-box;">
            </div>
            <strong>${sitio.nombre}</strong>
            <span style="font-size: 0.8em; color: #faf7f7; margin-top: 5px;">${sitio.desc}</span>
        `;
        container.appendChild(anchor);
    });
}

// Función auxiliar para el botón de "Mostrar todos"
function resetearBusqueda() {
    inputBuscador.value = ''; // Limpiamos el input
    renderizar(misEnlaces);   // Mostramos todo
}

function generarBotonesCategorias() {
    const todasLasCategorias = misEnlaces.map(sitio => sitio.categoria);
    const categoriasUnicas = [...new Set(todasLasCategorias)];

    categoriasUnicas.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'cat-btn';
        btn.textContent = cat;
        btn.setAttribute('data-categoria', cat);
        btn.addEventListener('click', () => filtrarPorCategoria(cat, btn));
        navCategorias.appendChild(btn);
    });

    // Botón Todos
    const btnTodos = document.querySelector('[data-categoria="todos"]');
    if(btnTodos) {
        btnTodos.addEventListener('click', function() {
            filtrarPorCategoria('todos', this);
        });
    }
}

// 3. LÓGICA DE FILTROS
function filtrarPorCategoria(categoriaSeleccionada, botonActivo) {
    document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
    botonActivo.classList.add('active');

    if (categoriaSeleccionada === 'todos') {
        renderizar(misEnlaces);
    } else {
        const filtrados = misEnlaces.filter(sitio => sitio.categoria === categoriaSeleccionada);
        renderizar(filtrados);
    }
}

// 4. EVENTOS
inputBuscador.addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = misEnlaces.filter(sitio => {
        const enNombre = sitio.nombre.toLowerCase().includes(texto);
        const enDesc = sitio.desc.toLowerCase().includes(texto);
        const enTags = sitio.tags.some(tag => tag.toLowerCase().includes(texto));
        return enNombre || enDesc || enTags;
    });
    renderizar(filtrados);
});

// 5. INICIALIZACIÓN (¡Importante el orden!)
generarBotonesCategorias();
renderizar(misEnlaces);