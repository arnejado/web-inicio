// 1. CONSTANTES Y SELECTORES
import { misEnlaces } from './config.js';

// Ahora tenemos dos contenedores
const containerHabituales = document.getElementById('links-principal');
const containerArchivo = document.getElementById('links-archivo');
const navCategorias = document.getElementById('categorias-nav');
const inputBuscador = document.getElementById('buscador');

// 2. FUNCIONES DE RENDERIZADO

// Función pequeña para crear el HTML de una tarjeta (así no repetimos código)
function crearCard(sitio) {
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
        <span style="font-size: 0.8em; color: #888; margin-top: 5px;">${sitio.desc}</span>
    `;
    return anchor;
}

function renderizar(lista) {
    // Limpiamos ambos contenedores
    containerHabituales.innerHTML = '';
    containerArchivo.innerHTML = '';
    
    // Si la lista está vacía
    if (lista.length === 0) {
        containerHabituales.innerHTML = `
            <div class="no-results">
                <p>No se han encontrado enlaces...</p>
                <button onclick="location.reload()" style="background:none; border:none; color:#00adb5; cursor:pointer; text-decoration:underline;">
                    Ver todo
                </button>
            </div>
        `;
        return;
    }

    // Clasificamos y dibujamos
    lista.forEach(sitio => {
        const card = crearCard(sitio);
        
        if (sitio.tipo === 'principal') {
            containerHabituales.appendChild(card);
        } else {
            containerArchivo.appendChild(card);
        }
    });
}

// 3. RESTO DE LÓGICA (Botones y Buscador)
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

    const btnTodos = document.querySelector('[data-categoria="todos"]');
    if(btnTodos) {
        btnTodos.addEventListener('click', function() {
            filtrarPorCategoria('todos', this);
        });
    }
}

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

// 5. INICIALIZACIÓN
generarBotonesCategorias();
renderizar(misEnlaces);