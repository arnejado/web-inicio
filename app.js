// 1. CONSTANTES Y SELECTORES
import { misEnlaces } from './config.js';

const containerHabituales = document.getElementById('links-principal');
const containerArchivo = document.getElementById('links-archivo');
const navCategorias = document.getElementById('categorias-nav');
const inputBuscador = document.getElementById('buscador');

// 2. FUNCIONES DE RENDERIZADO

function crearCard(sitio) {
    const nombreArchivo = sitio.nombre.toLowerCase();
    const rutaImagen = `img/${nombreArchivo}.png`;

    // Creamos el contenedor principal (el marco 3D)
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';

    // Inyectamos la estructura de dos caras
    cardContainer.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <a href="${sitio.url}" target="_blank" rel="noopener noreferrer" class="card-link">
                    <div class="card-img-wrapper">
                        <img src="${rutaImagen}" alt="${sitio.nombre}" onerror="this.onerror=null; this.src='img/notfound.png';">
                    </div>
                    <strong>${sitio.nombre}</strong>
                    <span class="card-desc">${sitio.desc}</span>
                </a>
                <button class="info-btn" title="Ver notas">i</button>
            </div>

            <div class="card-back">
                <div class="back-content">
                    <h4>${sitio.nombre}</h4>
                    <p>${sitio.nota || "No hay notas adicionales para este sitio."}</p>
                    <button class="close-btn">Volver</button>
                </div>
            </div>
        </div>
    `;

    // LÓGICA DEL FLIP
    const btnInfo = cardContainer.querySelector('.info-btn');
    const btnClose = cardContainer.querySelector('.close-btn');

    // Al hacer click en 'i', añadimos la clase que activa el giro en CSS
    btnInfo.addEventListener('click', (e) => {
        e.preventDefault(); // Por si acaso
        cardContainer.classList.add('flipped');
    });

    // Al hacer click en 'Volver', quitamos la clase
    btnClose.addEventListener('click', () => {
        cardContainer.classList.remove('flipped');
    });

    return cardContainer;
}

function renderizar(lista) {
    containerHabituales.innerHTML = '';
    containerArchivo.innerHTML = '';
    
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

    lista.forEach(sitio => {
        const card = crearCard(sitio);
        if (sitio.tipo === 'principal') {
            containerHabituales.appendChild(card);
        } else {
            containerArchivo.appendChild(card);
        }
    });
}

// 3. RESTO DE LÓGICA (Botones y Buscador) - SE MANTIENE IGUAL
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