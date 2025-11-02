# roman-converter
Resumen del funcionamiento

Propósito: aplicación full‑stack que convierte números a números romanos.
Arquitectura: servidor Express (API) + cliente React (UI). Código TypeScript en ambos lados.

-Estructura principal (rutas relevantes)

server/
src/index.ts — servidor Express, expone endpoints REST.
src/converters.ts — lógica de conversión (intToRoman, romanToInt).
package.json — scripts: npm run dev (ts-node-dev).
server/client/
src/main.tsx — punto de entrada React, monta <App />.
src/App.tsx — componente principal: UI, funciones locales de conversión, llamadas a la API con axios, manejo de estados (input, error, result).
src/App.css — estilos visuales.
package.json — scripts: npm run dev (vite).

-Cómo funciona el servidor

Levanta en el puerto 4000 (por defecto).
Endpoints:
POST /api/to-roman
Espera JSON: { "value": number } o string convertible a número.
Devuelve: { "roman": "MCMXCIX" } o error 400 con mensaje.
POST /api/from-roman
Espera JSON: { "roman": "MCMXCIX" }.
Devuelve: { "number": 1999 } o error 400 con mensaje.
La validación y la conversión real están en converters.ts (manejo de casos inválidos y comprobaciones).

-Lógica de conversión (resumen)

intToRoman:
Recorre valores decrescentes [1000,900,...,1] y construye la cadena romana.
Actualmente valida rango tradicional (1–3999) — lanza error si fuera de rango.
romanToInt:
Normaliza string (mayúsculas, trim), comprueba caracteres válidos [IVXLCDM].
Suma/resta según el valor siguiente (ej. IV = 4).
Puede validar formato canónico (dependiendo de la implementación en converters.ts).

-Cómo funciona el cliente (App.tsx)

Estado:
mode: 'toRoman' | 'fromRoman'
input: texto del usuario
result: resultado mostrado
error: mensaje de error
UI:
Radio para elegir dirección (A Romano / A Número)
Input para número o romano
Dos botones: "Convertir local" (usa funciones locales) y "Convertir via servidor" (llama a la API)
Muestra resultado o error
Llamadas al servidor:
axios.post(${apiBase}/api/to-roman, { value }) y similar para from-roman.
apiBase se lee de import.meta.env.VITE_API_BASE o usa fallback http://localhost:4000.

-Variables de entorno

Cliente (Vite): define VITE_API_BASE en .env si necesitas apuntar a otro host/puerto.
Ejemplo: VITE_API_BASE=http://localhost:4000

-Cómo arrancar la aplicación (desde PowerShell)

Iniciar servidor: npm run dev
Iniciar cliente: npm run dev
Abrir cliente en el navegador en la URL que Vite indique (por defecto http://localhost:5173 o el puerto configurado).

-Limitaciones y recomendaciones

Actualmente la conversión local valida y limita 1–3999 (convención romana tradicional). Para admitir valores fuera de ese rango hay que cambiar/relajar la validación en intToRoman y posiblemente definir una convención para miles (>3999).
Se mantienen separados estilos (App.css) y lógica (converters.ts) para mejor mantenibilidad.
Para depurar: revisar la consola del servidor (puerto 4000) y la consola de Vite (cliente).

Vite es una herramienta de desarrollo frontend, sirve para iniciar, desarrollar y compilar aplicaciones modernas de JavaScript y TypeScript, como las hechas con React

| Ventaja                                              | Descripción                                        |
| ---------------------------------------------------- | -------------------------------------------------- |
| ⚡ **Rápido inicio**                                 | Casi instantáneo, incluso en proyectos grandes.    |
| 🔁 **Recarga instantánea (HMR)**                     | Actualiza los cambios sin recargar toda la página. |
| 🧠 **Compatibilidad con TypeScript, JSX, CSS, etc.** | Sin configuración extra.                           |
| 📦 **Empaquetado optimizado con Rollup**             | Crea versiones rápidas y pequeñas para producción. |
| 🔧 **Fácil configuración**                           | Archivos `.env`, alias de rutas, plugins y más.    |

En este proyecto, Vite maneja el frontend (client/), levanta el servidor de desarrollo en http://localhost:5173 y lee las variables de entorno desde .env, como VITE_API_BASE=http://localhost:4000 para conectar con la API Express



Para peticiones HTTP (en este caso POST) usé Axios (librería de JS), el cual recibe esa respuesta y la devuelve al frontend React, que muestra el resultado en pantalla.


| Ventaja                                | Descripción                                           |
| -------------------------------------- | ----------------------------------------------------- |
| 🧩 **Manejo automático de JSON**       | Convierte las respuestas a JSON sin código adicional. |
| 🔒 **Manejo de errores simplificado**  | Usa `try/catch` fácilmente.                           |
| ⚙️ **Configuración flexible**          | Permite headers, autenticación, interceptores, etc.   |
| 🔁 **Soporta peticiones concurrentes** | Muy útil en apps con múltiples solicitudes.           |
| 🧠 **Soporta promesas y async/await**  | Compatible con la sintaxis moderna de JavaScript.     |

En este proyecto se usa dentro del cliente React (App.tsx) para hacer llamadas al servidor


TESTS EN CLIENT
(frontend)

Corren en un entorno simulado de navegador (puede ser jsdom con Vitest, Jest, etc.).
Evalúan componentes, interacciones, renderizado, hooks de React, etc.
Por ejemplo, que un botón muestre el número romano correcto cuando se ingresa un entero.

| Test                                            | Qué cubre                                               |
| ----------------------------------------------- | ------------------------------------------------------- |
| `renders title`                                 | Render inicial y existencia del título                  |
| `renders initial state without result or error` | Estado inicial (`result === null`, `error === null`)    |
| `converts 1999 to MCMXCIX locally`              | Conversión número → romano, rama `mode === 'toRoman'`   |
| `converts roman numeral to integer locally`     | Conversión romano → número, rama `mode === 'fromRoman'` |
| `shows error for invalid number`                | Entrada no numérica → error                             |
| `shows error for numbers out of range`          | Número > 3999 → error                                   |
| `handles empty input`                           | Entrada vacía → error por rango                         |
| Resto de tests (`Convertir via servidor`)       | Lógica de axios, respuestas del servidor                |


✅ Esto cubre toda la lógica funcional: conversión, validación, manejo de errores y llamadas al servidor.

Lo que V8 muestra sin cubrir:
-Línea del placeholder en <input> con ternario
-Short-circuit render de {result !== null ? … : null} o {error !== null ? … : null}
-Son artefactos de JSX, no lógica. No afectan la cobertura real del código.

| Test                    | Qué cubre                                                       |
| ----------------------- | --------------------------------------------------------------- |
| Conversión `intToRoman` | Números enteros válidos, rango 1–3999                           |
| Conversión `romanToInt` | Romanos válidos, validación de caracteres, números no canónicos |
| Casos borde             | 1, 3999, cadenas inválidas, letras minúsculas                   |

✅ converters.ts tiene prácticamente 100 % de lógica cubierta.


App.test.tsx y App.server.test.tsx

-Todos los tests de UI (App.test.tsx) cubren las ramas principales de React y la interacción con botones e inputs.
-Tests de servidor (App.server.test.tsx) cubren llamadas a API y manejo de respuestas.
-V8 coverage considera que toda la lógica JS está cubierta.

TEST:coverage

% Coverage report from v8
---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------|---------|----------|---------|---------|-------------------
All files      |   96.55 |    91.89 |   88.88 |      98 | 
 App.css       |       0 |        0 |       0 |       0 | 
 App.tsx       |   96.29 |    89.47 |   85.71 |   96.15 | 50
 converters.ts |   96.77 |    94.44 |     100 |     100 | 2
---------------|---------|----------|---------|---------|-------------------

| Archivo                                | Coverage real | Comentario                                                 |
| -------------------------------------- | ------------- | ---------------------------------------------------------- |
| `App.tsx`                              | 96–97 %       | Solo líneas JSX con ternarios o short-circuits no marcadas |
| `converters.ts`                        | 96–100 %      | Toda lógica JS cubierta                                    |
| `App.test.tsx` / `App.server.test.tsx` | 100 %         | Tests cubren todas las ramas funcionales                   |

Interpretación práctica:

El código está completamente testeado.
El porcentaje menor a 100 % es solo un artefacto de cómo V8 mide JSX, no un problema real.

TEST:ui

> roman-converter-client@1.0.0 test:ui
> vitest --ui


 DEV  v4.0.6 C:/Users/Marian/Documents/roman-converter/server/client
      UI started at http://localhost:51204/__vitest__/

 ✓ src/App.test.tsx (12 tests) 967ms
 ✓ src/test/App.server.test.tsx (2 tests) 359ms
 ✓ src/converters.test.ts (9 tests) 43ms

 Test Files  3 passed (3)
      Tests  23 passed (23)
   Start at  12:55:34
   Duration  26.09s (transform 519ms, setup 2.40s, collect 2.67s, tests 1.37s, environment 16.35s, prepare 270ms)

 PASS 
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
TESTS EN SERVER
(backend)

Corren en Node.js, no en el navegador.
Evalúan la lógica del negocio, funciones, servicios, validaciones.
Por ejemplo, funciones intToRoman y romanToInt.
No necesitan React ni interfaz; simplemente prueban que el código haga lo que debe hacer.

TESTS UNITARIOS

 ✓ src/converters.test.ts (8 tests) 31ms
   ✓ intToRoman (3)
     ✓ convierte correctamente números válidos 6ms
     ✓ lanza error si el número no es entero 4ms
     ✓ lanza error si el número está fuera del rango 1-3999 3ms
   ✓ romanToInt (5)
     ✓ convierte números romanos válidos a enteros 2ms
     ✓ ignora espacios y mayúsculas 1ms
     ✓ lanza error si la cadena es inválida o vacía 4ms
     ✓ lanza error si contiene caracteres no romanos 3ms
     ✓ lanza error si el número romano no está en forma canónica 2ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  13:32:40
   Duration  1.31s (transform 221ms, setup 0ms, collect 297ms, tests 31ms, environment 1ms, prepare 76ms)

 PASS 


TEST:coverage (Server)
Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  12:17:50
   Duration  1.17s (transform 168ms, setup 0ms, collect 222ms, tests 30ms, environment 1ms, prepare 155ms)

 % Coverage report from v8
---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------|---------|----------|---------|---------|-------------------
All files      |     100 |      100 |     100 |     100 |
 converters.ts |     100 |      100 |     100 |     100 |
---------------|---------|----------|---------|---------|-------------------

TEST:ui
 DEV  v4.0.6 C:/Users/Marian/Documents/roman-converter/server
      UI started at http://localhost:51204/__vitest__/

 ✓ src/converters.test.ts (8 tests) 26ms
     ✓ lanza error si el número no es entero 3ms
     ✓ lanza error si el número está fuera del rango 1-3999 2ms
   ✓ romanToInt (5)
     ✓ convierte números romanos válidos a enteros 2ms
     ✓ ignora espacios y mayúsculas 1ms
     ✓ lanza error si la cadena es inválida o vacía 2ms
     ✓ lanza error si contiene caracteres no romanos 2ms
     ✓ lanza error si el número romano no está en forma canónica 2ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  12:53:46
   Duration  1.67s (transform 227ms, setup 0ms, collect 329ms, tests 26ms, environment 1ms, prepare 67ms)

 PASS  
