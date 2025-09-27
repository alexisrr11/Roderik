// Menu toggle
const btnMenu = document.getElementById("boton-menu");
const listMenu = document.getElementById("list-menu");
btnMenu.addEventListener("click", () => {
    listMenu.classList.toggle("hidden");
});

//Conectar API
let todasComidas = [];
let todasBebidas = [];
let filtroIdSeleccionado = "Todos";
let filtroCategoriaSeleccionada = "Todos";

async function cargarProductos() {
    try {
        // Cargar comidas
        const resComida = await fetch("./productos/comida.json");
        todasComidas = await resComida.json();

        // Cargar bebidas
        const resBebida = await fetch("./productos/bebidas.json");
        todasBebidas = await resBebida.json();

        // Crear botones para IDs
        const ids = ["Todos", "Comidas", "Bebidas"];
        const filtrosPrincipales = document.getElementById("filtros-principales");

        ids.forEach(id => {
            const btn = document.createElement("button");
            btn.textContent = id;
            btn.className =
                "filtro-id bg-gray-700 hover:bg-yellow-500 hover:text-black text-white px-4 py-2 rounded-lg transition";
            btn.dataset.id = id;
            btn.addEventListener("click", () => {
                filtroIdSeleccionado = id;
                filtroCategoriaSeleccionada = "Todos"; // reset select
                document.getElementById("filtro-categorias").value = "Todos";
                renderizar();
            });
            filtrosPrincipales.appendChild(btn);
        });

        // Crear lista única de categorías
        const categorias = [
            "Todos",
            ...new Set([
                ...todasComidas.map(item => item.categoria),
                ...todasBebidas.map(item => item.categoria),
            ]),
        ];

        // Renderizar opciones en el select
        const select = document.getElementById("filtro-categorias");
        categorias.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });

        // Evento de cambio en el select
        select.addEventListener("change", (e) => {
            filtroCategoriaSeleccionada = e.target.value;
            filtroIdSeleccionado = "Todos"; // reset id
            renderizar();
        });

        // Render inicial
        renderizar();
    } catch (error) {
        console.error("Error al cargar los productos:", error);
    }
}

function renderizar() {
    const container = document.getElementById("productos-container");
    container.innerHTML = "";

    // Caso: mostrar por categoría específica
    if (filtroCategoriaSeleccionada !== "Todos") {
        const comidasFiltradas = todasComidas.filter(
            item => item.categoria === filtroCategoriaSeleccionada
        );
        const bebidasFiltradas = todasBebidas.filter(
            item => item.categoria === filtroCategoriaSeleccionada
        );

        if (comidasFiltradas.length > 0) {
            renderSeccion(filtroCategoriaSeleccionada, comidasFiltradas, container);
        }
        if (bebidasFiltradas.length > 0) {
            renderSeccion(filtroCategoriaSeleccionada, bebidasFiltradas, container);
        }
        return;
    }

    // Caso: mostrar por ID (Todos, Comidas, Bebidas)
    if (filtroIdSeleccionado === "Todos") {
        renderSeccion("Comidas", todasComidas, container);
        renderSeccion("Bebidas", todasBebidas, container);
    } else if (filtroIdSeleccionado === "Comidas") {
        renderSeccion("Comidas", todasComidas, container);
    } else if (filtroIdSeleccionado === "Bebidas") {
        renderSeccion("Bebidas", todasBebidas, container);
    }
}

function renderSeccion(titulo, items, container) {
    const section = document.createElement("section");
    section.className = "mt-12";

    section.innerHTML = `
      <h3 class="text-2xl font-semibold text-white mb-4">${titulo}</h3>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8"></div>
    `;

    const grid = section.querySelector("div");

    items.forEach(item => {
        grid.innerHTML += `
        <div class="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:scale-105 transition">
          <img src="${item.imagen}" alt="${item.nombre}" class="w-full h-48 object-cover">
          <div class="p-4">
            <h4 class="text-xl font-bold text-yellow-400">${item.nombre}</h4>
            ${item.descripcion
                ? `<p class="text-gray-300 text-sm mb-2">${item.descripcion}</p>`
                : ""
            }
            <p class="text-gray-200 font-semibold">$${item.precio}</p>
          </div>
        </div>
      `;
    });

    container.appendChild(section);
}

document.addEventListener("DOMContentLoaded", cargarProductos);

//Ver ofertas
window.onload = function () {
    const modal = document.getElementById("modal-ofertas");
    const listaOfertas = document.getElementById("lista-ofertas");
    const contenedor = document.getElementById("contenedor-ofertas");
    const titulo = document.getElementById("titulo-ofertas");
    const btnConsultaWp = document.getElementById("botonConsultaWhatsapp");

    // Array de ofertas por día - Cervecería Roderick
    const ofertasPorDia = {
        1: [
            "🍺 Lunes: 2x1 en Pintas de Cerveza Rubia",
            "🍔 20% OFF en Hamburguesa Clásica Roderick"
        ],
        2: [
            "🍺 Martes: 20% OFF en IPA artesanal",
            "🌮 Promo: 2 Tacos al precio de 1"
        ],
        3: [
            "🍺 Miércoles: Happy Hour de 18 a 20 hs en todas las cervezas",
            "🍟 Papas Roderick con cheddar 15% OFF"
        ],
        4: [
            "🍺 Jueves: 3x2 en pinta de Cerveza Negra",
            "🥩 Alitas de Pollo BBQ con 10% OFF"
        ],
        5: [
            "🍺 Viernes: 2x1 en Jarra de Cerveza Rubia",
            "🌭 Hot Dog Roderick con 15% OFF"
        ],
        6: [
            "🍺 Sábado: Combo Burger + Pinta con 20% OFF",
            "🍕 Pizza Roderick (especialidad de la casa) 10% OFF"
        ],
        7: [
            "🍺 Domingo: 2x1 en Cerveza de Trigo",
            "🍖 Costillitas con salsa BBQ 15% OFF"
        ]
    };

    // Obtener el día actual
    const diaHoy = new Date().getDay();

    //  Llenar el MODAL
    if (listaOfertas) {
        if (ofertasPorDia[diaHoy]) {
            ofertasPorDia[diaHoy].forEach(oferta => {
                const li = document.createElement("li");
                li.textContent = oferta;
                listaOfertas.appendChild(li);
            });
        } else {
            const li = document.createElement("li");
            li.textContent = "No tenemos ofertas especiales para hoy, vuelva mañana. Lo esperamos😊";
            listaOfertas.appendChild(li);
            btnConsultaWp.classList.add("hidden");
        }

        // Mostrar modal automáticamente
        modal.classList.remove("hidden");
    }

    // Llenar la SECCIÓN DE OFERTAS
    if (contenedor && titulo) {
        contenedor.innerHTML = "";

        if (ofertasPorDia[diaHoy]) {
            const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
            titulo.textContent = `Ofertas del ${diasSemana[diaHoy]}`;

            ofertasPorDia[diaHoy].forEach((oferta) => {
                const card = document.createElement("div");
                card.className = "relative bg-cover rounded-xl shadow-lg p-6 text-center text-white";

                // Overlay negro
                const overlay = document.createElement("div");
                overlay.className = "absolute inset-0 bg-green-50 rounded-xl my-1";
                card.appendChild(overlay);

                // Texto oferta
                const content = document.createElement("div");
                content.className = "relative z-10 text-black";
                const p = document.createElement("p");
                p.textContent = oferta;
                content.appendChild(p);

                card.appendChild(content);
                contenedor.appendChild(card);
            });
        } else {
            titulo.textContent = "No tenemos ofertas especiales para hoy";
            const msg = document.createElement("p");
            msg.className = "text-center text-gray-600 col-span-3";
            msg.textContent = "Vuelve mañana para ver nuestras promociones 😊";
            contenedor.appendChild(msg);
        }
    }

};

//Modales y ofertas
const modal = document.getElementById("ofertasModal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

const slider = document.getElementById("slider");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

let index = 0;

openModal.addEventListener("click", () => modal.classList.remove("hidden"));
closeModal.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });

nextBtn.addEventListener("click", () => {
    if (index < 2) index++;
    else index = 0;
    slider.style.transform = `translateX(-${index * 100}%)`;
});

prevBtn.addEventListener("click", () => {
    if (index > 0) index--;
    else index = 2;
    slider.style.transform = `translateX(-${index * 100}%)`;

});
