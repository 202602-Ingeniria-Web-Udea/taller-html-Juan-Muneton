/* =========================================================
   POKÉEXPLORER
   Aplicación web utilizando:
   - HTML
   - CSS
   - JavaScript
   - PokéAPI
   ========================================================= */


/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const API_URL =
    "https://pokeapi.co/api/v2/pokemon";


const POKEMON_PER_PAGE = 10;


/*
 * Cantidad máxima de botones de páginas que se muestran
 * simultáneamente en la barra de navegación.
 */
const VISIBLE_PAGE_BUTTONS = 5;


/* =========================================================
   ESTADO DE LA APLICACIÓN
   ========================================================= */

let currentPage = 1;

let totalPokemon = 0;

let totalPages = 0;


/* =========================================================
   REFERENCIAS AL DOM
   ========================================================= */

const pokemonContainer =
    document.getElementById("pokemonContainer");


const searchForm =
    document.getElementById("searchForm");


const searchInput =
    document.getElementById("searchInput");


const showAllButton =
    document.getElementById("showAllButton");


const randomButton =
    document.getElementById("randomButton");


const favoritesButton =
    document.getElementById("favoritesButton");


const themeButton =
    document.getElementById("themeButton");


const loadingMessage =
    document.getElementById("loadingMessage");


const errorMessage =
    document.getElementById("errorMessage");


const errorText =
    document.getElementById("errorText");


const resultsTitle =
    document.getElementById("resultsTitle");


const resultsCount =
    document.getElementById("resultsCount");


const pagination =
    document.getElementById("pagination");


/* =========================================================
   EVENTOS
   ========================================================= */


/*
 * Ejecuta la búsqueda cuando se envía el formulario.
 */
searchForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        searchPokemon();

    }
);


/*
 * Regresa a la vista principal de la Pokédex.
 */
showAllButton.addEventListener(
    "click",
    function () {

        loadPage(1);

    }
);


/*
 * Carga un Pokémon aleatorio.
 */
randomButton.addEventListener(
    "click",
    function () {

        loadRandomPokemon();

    }
);


/*
 * Muestra los Pokémon favoritos.
 */
favoritesButton.addEventListener(
    "click",
    function () {

        showFavorites();

    }
);


/*
 * Cambia el tema de la aplicación.
 */
themeButton.addEventListener(
    "click",
    function () {

        toggleTheme();

    }
);


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadInitialPokemon();

        loadSavedTheme();

    }
);


/* =========================================================
   CARGA INICIAL
   ========================================================= */

async function loadInitialPokemon() {

    showLoading();

    hideError();

    try {

        /*
         * Esta petición especial utiliza limit=1.
         *
         * Lo importante de esta respuesta es "count",
         * que indica cuántos Pokémon existen en la API.
         */
        const response =
            await fetch(
                `${API_URL}?limit=1`
            );


        if (!response.ok) {

            throw new Error(
                "No fue posible obtener la cantidad de Pokémon."
            );

        }


        const data =
            await response.json();


        /*
         * Guardamos la cantidad total.
         */
        totalPokemon =
            data.count;


        /*
         * Calculamos cuántas páginas/grupos de 10 existen.
         *
         * Math.ceil() permite manejar correctamente
         * el último grupo si no contiene exactamente 10.
         */
        totalPages =
            Math.ceil(
                totalPokemon / POKEMON_PER_PAGE
            );


        /*
         * Generamos la barra de navegación.
         */
        createPagination();


        /*
         * Cargamos la primera página.
         */
        await loadPage(1);


    } catch (error) {

        console.error(
            "Error inicializando la Pokédex:",
            error
        );


        showError(
            "No fue posible cargar la Pokédex. " +
            "Verifica tu conexión a Internet e inténtalo nuevamente."
        );


    } finally {

        hideLoading();

    }

}


/* =========================================================
   CARGAR UNA PÁGINA DE 10 POKÉMON
   ========================================================= */

async function loadPage(page) {

    /*
     * Evitamos números de página inválidos.
     */
    if (
        page < 1 ||
        page > totalPages
    ) {

        return;

    }


    currentPage =
        page;


    showLoading();

    hideError();

    clearPokemonContainer();


    /*
     * Calculamos el offset.
     *
     * Página 1:
     * offset = 0
     *
     * Página 2:
     * offset = 10
     *
     * Página 3:
     * offset = 20
     *
     * etc.
     */
    const offset =
        (page - 1) *
        POKEMON_PER_PAGE;


    try {

        /*
         * Solicitamos solamente los 10 Pokémon
         * correspondientes a la página actual.
         */
        const response =
            await fetch(
                `${API_URL}?limit=${POKEMON_PER_PAGE}&offset=${offset}`
            );


        if (!response.ok) {

            throw new Error(
                "No fue posible obtener los Pokémon."
            );

        }


        const data =
            await response.json();


        /*
         * Cada resultado contiene la URL del Pokémon.
         *
         * Hacemos las consultas individuales en paralelo
         * utilizando Promise.all().
         */
        const pokemonPromises =
            data.results.map(
                pokemon =>
                    fetchPokemonData(
                        pokemon.url
                    )
            );


        const pokemonList =
            await Promise.all(
                pokemonPromises
            );


        /*
         * Mostramos los resultados.
         */
        displayPokemonList(
            pokemonList
        );


        /*
         * Actualizamos el encabezado.
         */
        updateResultsHeader();


        /*
         * Actualizamos visualmente la paginación.
         */
        createPagination();


        /*
         * Volvemos al inicio de la sección de resultados.
         *
         * Esto evita que el usuario quede en una posición
         * extraña cuando cambia de página.
         */
        document
            .querySelector(".results-section")
            .scrollIntoView({
                behavior: "smooth",
                block: "start"
            });


    } catch (error) {

        console.error(
            "Error cargando página:",
            error
        );


        showError(
            "No fue posible cargar este grupo de Pokémon. " +
            "Inténtalo nuevamente."
        );


    } finally {

        hideLoading();

    }

}


/* =========================================================
   ACTUALIZAR ENCABEZADO DE RESULTADOS
   ========================================================= */

function updateResultsHeader() {

    const start =
        (currentPage - 1) *
        POKEMON_PER_PAGE +
        1;


    /*
     * El último grupo podría tener menos de 10 Pokémon.
     */
    const end =
        Math.min(
            currentPage *
                POKEMON_PER_PAGE,
            totalPokemon
        );


    resultsTitle.textContent =
        "Pokémon";


    resultsCount.textContent =
        `Explorando Pokémon ${start}–${end} de ${totalPokemon}.`;

}


/* =========================================================
   CREAR BARRA DE PAGINACIÓN
   ========================================================= */

function createPagination() {

    /*
     * Si todavía no conocemos el total,
     * no mostramos la navegación.
     */
    if (
        totalPages === 0
    ) {

        pagination.classList.add(
            "hidden"
        );

        return;

    }


    pagination.classList.remove(
        "hidden"
    );


    /*
     * Limpiamos la navegación anterior.
     */
    pagination.innerHTML = "";


    /* =====================================================
       BOTÓN ANTERIOR
       ===================================================== */

    const previousButton =
        document.createElement("button");


    previousButton.className =
        "pagination-button pagination-arrow";


    previousButton.type =
        "button";


    previousButton.textContent =
        "←";


    previousButton.title =
        "Grupo anterior";


    previousButton.setAttribute(
        "aria-label",
        "Grupo anterior"
    );


    /*
     * Deshabilitamos el botón cuando estamos
     * en el primer grupo.
     */
    previousButton.disabled =
        currentPage === 1;


    previousButton.addEventListener(
        "click",
        function () {

            if (
                currentPage > 1
            ) {

                loadPage(
                    currentPage - 1
                );

            }

        }
    );


    pagination.appendChild(
        previousButton
    );


    /* =====================================================
       CALCULAR BOTONES VISIBLES
       ===================================================== */

    let startPage =
        Math.max(
            1,
            currentPage -
                Math.floor(
                    VISIBLE_PAGE_BUTTONS / 2
                )
        );


    let endPage =
        Math.min(
            totalPages,
            startPage +
                VISIBLE_PAGE_BUTTONS -
                1
        );


    /*
     * Ajustamos nuevamente el inicio cuando estamos
     * cerca del final de la Pokédex.
     */
    if (
        endPage - startPage + 1 <
        VISIBLE_PAGE_BUTTONS
    ) {

        startPage =
            Math.max(
                1,
                endPage -
                    VISIBLE_PAGE_BUTTONS +
                    1
            );

    }


    /* =====================================================
       BOTONES DE GRUPOS
       ===================================================== */

    for (
        let page = startPage;
        page <= endPage;
        page++
    ) {

        const pageButton =
            document.createElement("button");


        pageButton.className =
            "pagination-button";


        pageButton.type =
            "button";


        /*
         * Calculamos el rango que representa
         * cada botón.
         *
         * Página 1 → 1-10
         * Página 2 → 11-20
         * Página 3 → 21-30
         */
        const start =
            (page - 1) *
                POKEMON_PER_PAGE +
            1;


        const end =
            Math.min(
                page *
                    POKEMON_PER_PAGE,
                totalPokemon
            );


        pageButton.textContent =
            `${start}-${end}`;


        pageButton.setAttribute(
            "aria-label",
            `Pokémon ${start} al ${end}`
        );


        /*
         * Marcamos visualmente la página actual.
         */
        if (
            page === currentPage
        ) {

            pageButton.classList.add(
                "active"
            );

        }


        pageButton.addEventListener(
            "click",
            function () {

                loadPage(page);

            }
        );


        pagination.appendChild(
            pageButton
        );

    }


    /* =====================================================
       BOTÓN SIGUIENTE
       ===================================================== */

    const nextButton =
        document.createElement("button");


    nextButton.className =
        "pagination-button pagination-arrow";


    nextButton.type =
        "button";


    nextButton.textContent =
        "→";


    nextButton.title =
        "Siguiente grupo";


    nextButton.setAttribute(
        "aria-label",
        "Siguiente grupo"
    );


    /*
     * Deshabilitamos el botón cuando estamos
     * en el último grupo.
     */
    nextButton.disabled =
        currentPage === totalPages;


    nextButton.addEventListener(
        "click",
        function () {

            if (
                currentPage < totalPages
            ) {

                loadPage(
                    currentPage + 1
                );

            }

        }
    );


    pagination.appendChild(
        nextButton
    );

}


/* =========================================================
   OBTENER INFORMACIÓN DE UN POKÉMON
   ========================================================= */

async function fetchPokemonData(url) {

    const response =
        await fetch(url);


    if (!response.ok) {

        throw new Error(
            "No fue posible obtener la información del Pokémon."
        );

    }


    return await response.json();

}


/* =========================================================
   BUSCAR POKÉMON
   ========================================================= */

async function searchPokemon() {

    const pokemonName =
        searchInput.value
            .trim()
            .toLowerCase();


    /*
     * Validación del campo.
     */
    if (
        pokemonName === ""
    ) {

        showError(
            "Escribe el nombre de un Pokémon para realizar la búsqueda."
        );

        return;

    }


    showLoading();

    hideError();

    clearPokemonContainer();


    /*
     * Ocultamos temporalmente la paginación durante
     * una búsqueda individual.
     */
    pagination.classList.add(
        "hidden"
    );


    try {

        const response =
            await fetch(
                `${API_URL}/${encodeURIComponent(
                    pokemonName
                )}`
            );


        /*
         * Controlamos el Pokémon inexistente.
         */
        if (
            !response.ok
        ) {

            if (
                response.status === 404
            ) {

                throw new Error(
                    `No encontramos ningún Pokémon llamado "${pokemonName}".`
                );

            }


            throw new Error(
                "Ocurrió un problema al consultar la API."
            );

        }


        const pokemon =
            await response.json();


        resultsTitle.textContent =
            "Resultado de búsqueda";


        resultsCount.textContent =
            "Se encontró 1 Pokémon.";


        displayPokemonList(
            [pokemon]
        );


    } catch (error) {

        console.error(
            "Error en la búsqueda:",
            error
        );


        showError(
            error.message
        );


    } finally {

        hideLoading();

    }

}


/* =========================================================
   MOSTRAR LISTA
   ========================================================= */

function displayPokemonList(
    pokemonList
) {

    clearPokemonContainer();


    pokemonList.forEach(
        function (pokemon) {

            const card =
                createPokemonCard(
                    pokemon
                );


            pokemonContainer.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   CREAR TARJETA
   ========================================================= */

function createPokemonCard(
    pokemon
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "pokemon-card";


    const primaryType =
        pokemon.types[0]
            .type.name;


    const isFavorite =
        isPokemonFavorite(
            pokemon.id
        );


    card.innerHTML = `
        <button
            class="favorite-button ${
                isFavorite
                    ? "active"
                    : ""
            }"
            type="button"
            aria-label="Agregar a favoritos"
            title="Agregar o quitar de favoritos"
        >
            ${
                isFavorite
                    ? "❤️"
                    : "♡"
            }
        </button>


        <span class="pokemon-number">
            #${formatPokemonId(
                pokemon.id
            )}
        </span>


        <div class="pokemon-image-container">

            <img
                class="pokemon-image"
                src="${
                    pokemon.sprites
                        .front_default
                }"
                alt="Imagen de ${
                    pokemon.name
                }"
                loading="lazy"
            >

        </div>


        <h3 class="pokemon-name">
            ${pokemon.name}
        </h3>


        <span class="pokemon-type">
            Tipo: ${primaryType}
        </span>
    `;


    /*
     * Evento del botón de favoritos.
     */
    const favoriteButton =
        card.querySelector(
            ".favorite-button"
        );


    favoriteButton.addEventListener(
        "click",
        function () {

            toggleFavorite(
                pokemon
            );


            updateFavoriteButton(
                favoriteButton,
                pokemon.id
            );

        }
    );


    return card;

}


/* =========================================================
   FORMATEAR ID
   ========================================================= */

function formatPokemonId(
    id
) {

    return String(id)
        .padStart(3, "0");

}


/* =========================================================
   FAVORITOS
   ========================================================= */

function getFavorites() {

    const savedFavorites =
        localStorage.getItem(
            "pokemonFavorites"
        );


    if (
        !savedFavorites
    ) {

        return [];

    }


    try {

        return JSON.parse(
            savedFavorites
        );

    } catch (error) {

        console.error(
            "Error leyendo favoritos:",
            error
        );


        return [];

    }

}


/*
 * Guarda favoritos.
 */
function saveFavorites(
    favorites
) {

    localStorage.setItem(
        "pokemonFavorites",
        JSON.stringify(
            favorites
        )
    );

}


/*
 * Comprueba si un Pokémon es favorito.
 */
function isPokemonFavorite(
    pokemonId
) {

    const favorites =
        getFavorites();


    return favorites.some(
        pokemon =>
            pokemon.id === pokemonId
    );

}


/*
 * Agrega o elimina un favorito.
 */
function toggleFavorite(
    pokemon
) {

    let favorites =
        getFavorites();


    const alreadyFavorite =
        favorites.some(
            favorite =>
                favorite.id ===
                pokemon.id
        );


    if (
        alreadyFavorite
    ) {

        favorites =
            favorites.filter(
                favorite =>
                    favorite.id !==
                    pokemon.id
            );

    } else {

        favorites.push({

            id: pokemon.id,

            name: pokemon.name,

            image:
                pokemon.sprites
                    .front_default,

            type:
                pokemon.types[0]
                    .type.name

        });

    }


    saveFavorites(
        favorites
    );

}


/*
 * Actualiza el corazón de la tarjeta.
 */
function updateFavoriteButton(
    button,
    pokemonId
) {

    const isFavorite =
        isPokemonFavorite(
            pokemonId
        );


    button.textContent =
        isFavorite
            ? "❤️"
            : "♡";


    button.classList.toggle(
        "active",
        isFavorite
    );

}


/* =========================================================
   MOSTRAR FAVORITOS
   ========================================================= */

function showFavorites() {

    hideError();

    const favorites =
        getFavorites();


    clearPokemonContainer();


    /*
     * Ocultamos la paginación porque los favoritos
     * representan una vista diferente.
     */
    pagination.classList.add(
        "hidden"
    );


    resultsTitle.textContent =
        "Mis Pokémon favoritos";


    if (
        favorites.length === 0
    ) {

        resultsCount.textContent =
            "Todavía no tienes Pokémon favoritos.";


        pokemonContainer.innerHTML = `
            <div class="empty-state">

                <div class="empty-state-icon">
                    ❤️
                </div>


                <h3>
                    No tienes favoritos
                </h3>


                <p>
                    Presiona el corazón de una tarjeta
                    para agregar un Pokémon a favoritos.
                </p>

            </div>
        `;


        return;

    }


    resultsCount.textContent =
        `Tienes ${favorites.length} Pokémon favorito(s).`;


    favorites.forEach(
        function (pokemon) {

            const card =
                createFavoriteCard(
                    pokemon
                );


            pokemonContainer.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   TARJETA DE FAVORITO
   ========================================================= */

function createFavoriteCard(
    pokemon
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "pokemon-card";


    card.innerHTML = `
        <button
            class="favorite-button active"
            type="button"
            aria-label="Quitar de favoritos"
            title="Quitar de favoritos"
        >
            ❤️
        </button>


        <span class="pokemon-number">
            #${formatPokemonId(
                pokemon.id
            )}
        </span>


        <div class="pokemon-image-container">

            <img
                class="pokemon-image"
                src="${pokemon.image}"
                alt="Imagen de ${
                    pokemon.name
                }"
                loading="lazy"
            >

        </div>


        <h3 class="pokemon-name">
            ${pokemon.name}
        </h3>


        <span class="pokemon-type">
            Tipo: ${pokemon.type}
        </span>
    `;


    const favoriteButton =
        card.querySelector(
            ".favorite-button"
        );


    favoriteButton.addEventListener(
        "click",
        function () {

            toggleFavorite({

                id: pokemon.id,

                name: pokemon.name,

                sprites: {

                    front_default:
                        pokemon.image

                },

                types: [

                    {

                        type: {

                            name:
                                pokemon.type

                        }

                    }

                ]

            });


            showFavorites();

        }
    );


    return card;

}


/* =========================================================
   POKÉMON ALEATORIO
   ========================================================= */

async function loadRandomPokemon() {

    showLoading();

    hideError();

    clearPokemonContainer();


    /*
     * Utilizamos los primeros 151 Pokémon.
     */
    const randomId =
        Math.floor(
            Math.random() * 151
        ) + 1;


    /*
     * Ocultamos la paginación mientras mostramos
     * un Pokémon individual.
     */
    pagination.classList.add(
        "hidden"
    );


    try {

        const response =
            await fetch(
                `${API_URL}/${randomId}`
            );


        if (
            !response.ok
        ) {

            throw new Error(
                "No fue posible obtener el Pokémon aleatorio."
            );

        }


        const pokemon =
            await response.json();


        resultsTitle.textContent =
            "Pokémon aleatorio";


        resultsCount.textContent =
            "Se ha seleccionado un Pokémon al azar.";


        displayPokemonList(
            [pokemon]
        );


    } catch (error) {

        console.error(
            "Error obteniendo Pokémon aleatorio:",
            error
        );


        showError(
            "No fue posible obtener un Pokémon aleatorio."
        );


    } finally {

        hideLoading();

    }

}


/* =========================================================
   MODO OSCURO
   ========================================================= */

function toggleTheme() {

    document.body.classList.toggle(
        "dark-mode"
    );


    const darkModeEnabled =
        document.body.classList.contains(
            "dark-mode"
        );


    themeButton.textContent =
        darkModeEnabled
            ? "☀️"
            : "🌙";


    localStorage.setItem(
        "darkMode",
        darkModeEnabled
    );

}


/*
 * Carga el tema almacenado.
 */
function loadSavedTheme() {

    const darkMode =
        localStorage.getItem(
            "darkMode"
        );


    if (
        darkMode === "true"
    ) {

        document.body.classList.add(
            "dark-mode"
        );


        themeButton.textContent =
            "☀️";

    }

}


/* =========================================================
   FUNCIONES DE INTERFAZ
   ========================================================= */

function showLoading() {

    loadingMessage.classList.remove(
        "hidden"
    );

}


function hideLoading() {

    loadingMessage.classList.add(
        "hidden"
    );

}


function showError(
    message
) {

    errorText.textContent =
        message;


    errorMessage.classList.remove(
        "hidden"
    );

}


function hideError() {

    errorMessage.classList.add(
        "hidden"
    );

}


function clearPokemonContainer() {

    pokemonContainer.innerHTML =
        "";

}