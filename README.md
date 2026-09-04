# PokéExplorer

Aplicación web interactiva desarrollada con **HTML, CSS y JavaScript** que permite consultar y explorar información de Pokémon mediante una API pública **PokéAPI**.

## Descripción

PokéExplorer es una aplicación web que permite al usuario consultar información de diferentes Pokémon de manera sencilla e interactiva.

Al iniciar la aplicación se muestran los primeros 10 Pokémon de la Pokédex. El usuario también puede buscar un Pokémon específico, consultar un Pokémon aleatorio, guardar Pokémon como favoritos y cambiar entre modo claro y oscuro.

El proyecto fue desarrollado utilizando tecnologías web fundamentales, sin utilizar frameworks ni librerías externas.

## Objetivos

* Aplicar conocimientos de HTML5 para estructurar una aplicación web.
* Utilizar CSS3 para crear una interfaz atractiva y responsive.
* Utilizar JavaScript para implementar la lógica de la aplicación.
* Consumir información desde una API pública utilizando `fetch()`.
* Procesar y mostrar información obtenida desde una API.
* Implementar manejo de errores.
* Utilizar `localStorage` para almacenar información en el navegador.
* Aplicar principios básicos de usabilidad y diseño responsive.

## API utilizada

El proyecto utiliza **PokéAPI**, una API pública que proporciona información sobre Pokémon.

Sitio oficial:

https://pokeapi.co/

Endpoint principal utilizado:

```text
https://pokeapi.co/api/v2/pokemon
```

## Tecnologías utilizadas

* HTML5
* CSS3
* JavaScript
* Fetch API
* PokéAPI
* LocalStorage

## Funcionalidades

### 1. Listado inicial

Al cargar la aplicación se realiza una consulta a PokéAPI y se muestran los primeros 10 Pokémon.

Cada tarjeta contiene:

* Imagen del Pokémon.
* Nombre.
* Número de Pokédex.
* Tipo principal.

### 2. Búsqueda

El usuario puede introducir el nombre de un Pokémon en el campo de búsqueda.

Ejemplo:

```text
pikachu
```

La aplicación realiza una consulta a PokéAPI y muestra la información correspondiente.

### 3. Manejo de errores

La aplicación controla diferentes situaciones, entre ellas:

* Campo de búsqueda vacío.
* Pokémon inexistente.
* Errores de comunicación con la API.
* Problemas de conexión a Internet.

Cuando ocurre un error se muestra un mensaje informativo para el usuario.

### 4. Pokémon aleatorio

La aplicación incluye un botón que selecciona aleatoriamente uno de los primeros 151 Pokémon y muestra su información.

### 5. Favoritos

Cada tarjeta contiene un botón para agregar o eliminar un Pokémon de favoritos.

Los favoritos se almacenan utilizando `localStorage`, por lo que permanecen guardados aunque el usuario cierre o recargue la página.

### 6. Modo claro y oscuro

La interfaz incluye un botón que permite cambiar entre modo claro y modo oscuro.

La preferencia seleccionada se almacena en `localStorage`.

### 7. Diseño responsive

La interfaz utiliza CSS Grid y media queries para adaptarse a diferentes tamaños de pantalla.

El diseño fue pensado para funcionar en:

* Computadores.
* Tablets.
* Teléfonos móviles.

## Estructura del proyecto

```text
poke-explorer/
│
├── index.html
├── styles.css
├── app.js
└── README.md
```

### index.html

Contiene la estructura principal de la aplicación:

* Encabezado.
* Buscador.
* Botones de interacción.
* Contenedor de resultados.
* Mensajes de carga y error.
* Pie de página.

### styles.css

Contiene todos los estilos visuales de la aplicación:

* Colores.
* Tipografía.
* Tarjetas.
* Botones.
* Grid.
* Animaciones.
* Modo oscuro.
* Diseño responsive.

### app.js

Contiene la lógica de funcionamiento:

* Consumo de PokéAPI.
* Búsqueda de Pokémon.
* Creación dinámica de tarjetas.
* Manejo de errores.
* Pokémon aleatorio.
* Gestión de favoritos.
* Uso de `localStorage`.
* Cambio de tema.

## Cómo ejecutar el proyecto

### Opción 1: Abrir directamente

Descargar o clonar el proyecto y abrir el archivo:

```text
index.html
```

en un navegador web.

### Opción 2: Utilizar Visual Studio Code

1. Abrir la carpeta `poke-explorer` en Visual Studio Code.
2. Instalar la extensión **Live Server**, si se desea.
3. Hacer clic derecho sobre `index.html`.
4. Seleccionar **Open with Live Server**.
5. La aplicación se abrirá en el navegador.

## Pruebas realizadas

Para comprobar el funcionamiento de la aplicación se deben realizar las siguientes pruebas:

| Prueba                        | Resultado esperado              |
| ----------------------------- | ------------------------------- |
| Abrir la aplicación           | Se muestran 10 Pokémon          |
| Buscar `pikachu`              | Se muestra Pikachu              |
| Buscar un Pokémon inexistente | Se muestra un mensaje de error  |
| Buscar con el campo vacío     | Se solicita ingresar un nombre  |
| Presionar Pokémon aleatorio   | Se muestra un Pokémon aleatorio |
| Agregar favorito              | El Pokémon queda guardado       |
| Recargar la página            | Los favoritos permanecen        |
| Activar modo oscuro           | Cambia la apariencia            |
| Cambiar tamaño de pantalla    | La interfaz se adapta           |
| Sin conexión a Internet       | Se muestra un mensaje de error  |

## Manejo de errores

El consumo de la API se realiza mediante `fetch()` y funciones asíncronas utilizando `async/await`.

Las respuestas HTTP son verificadas mediante `response.ok`.

Cuando una búsqueda devuelve un código `404`, la aplicación informa al usuario que el Pokémon no fue encontrado.

También se utiliza `try/catch` para controlar errores relacionados con las solicitudes a la API.

## Consideraciones de diseño

La interfaz utiliza una estructura basada en tarjetas para facilitar la visualización de la información.

Se utilizaron:

* Jerarquía visual.
* Espaciado consistente.
* Botones claramente identificables.
* Contraste entre elementos.
* Diseño responsive.
* Estados visuales para interacción.
* Mensajes de carga y error.

El objetivo es que el usuario pueda identificar rápidamente el buscador y comprender la información presentada en cada tarjeta.

## Innovación y creatividad

Además del listado y búsqueda solicitados, el proyecto incorpora funcionalidades adicionales:

1. Sistema de favoritos.
2. Persistencia de favoritos mediante `localStorage`.
3. Pokémon aleatorio.
4. Modo claro y oscuro.
5. Interfaz responsive.
6. Indicador visual de carga.
7. Mensajes específicos para diferentes errores.
8. Navegación entre grupos de 10 pokemón

Estas funcionalidades buscan mejorar la experiencia del usuario y demostrar un uso más amplio de JavaScript.

## Autor

**Juan Diego Muñetón Herrera**

Proyecto académico desarrollado para el taller de Ingeniería Web.

## Licencia y fuente de datos

La información de los Pokémon es obtenida mediante PokéAPI:

https://pokeapi.co/

El proyecto es de carácter académico y educativo.
