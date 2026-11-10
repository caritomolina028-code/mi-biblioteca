# Informe – TP 2 Desarrollo Frontend II

**Alumna:** Carolina Molina

## Enlaces

- **App (Vercel):** https://mi-biblioteca-zeta.vercel.app/
- **Repositorio (GitHub):** https://github.com/caritomolina028-code/mi-biblioteca
- **Bitácora:** BITACORA.md en el repositorio
- **Mini video:** https://www.youtube.com/watch?v=R722E3pPGxY

## Idea y público

Mi biblioteca es una aplicación para personas a las que les gusta leer. Sirve para dos cosas:

- **No olvidarse de los libros que quieren leer:** cuando alguien encuentra un libro que le interesa, porque se lo recomendó un conocido, lo vio en un video o leyó una reseña, lo puede guardar en la app como "Quiero leer".
- **Llevar un listado de los libros que ya leyó**, marcándolos como "Leído".

## Funciones implementadas

- Agregar un libro con título, autor y género, guardándolo en un solo paso con los botones "Quiero leer", "Leyendo" o "Leído".
- **"Leyendo ahora":** apartado arriba de todo, lo primero que se ve al entrar, con los libros que se están leyendo.
- **Buscar el libro en Google Books mientras se escribe el título** (y el autor, si hay muchos títulos parecidos): al elegirlo de la lista se completan solos el título, el autor, el género (traducido al español) y la portada.
- **Portadas reales** en las tarjetas de los libros elegidos desde Google Books.
- **"Ver más":** ventana con la sinopsis, el año, la editorial y las páginas del libro, pedidos a Google Books en el momento.
- Ver la colección, con contadores de libros totales, por leer, leyendo y leídos. Los contadores también funcionan como filtros: al tocarlos se ven solo esos libros.
- **Paginación:** la colección muestra 6 libros por página, en orden alfabético, dentro del filtro y la búsqueda elegidos.
- Cambiar el estado de un libro siguiendo el recorrido de una lectura: "Empezar a leer", "Marcar como leído" o "Marcar como pendiente".
- Editar los datos de un libro.
- Eliminar un libro (con confirmación).
- Buscar por título o autor.
- Mensajes de carga, éxito y error, cerca de donde se hizo la acción (el de eliminar, en rojo, en la colección); validación de campos obligatorios.
- Diseño adaptado a computadora y celular.

## Información guardada en Firebase

Colección `libros` en Cloud Firestore. Cada documento tiene `titulo`, `autor`, `genero`, `estado` ("Quiero leer", "Leyendo" o "Leído") y `ownerId` (el identificador del usuario anónimo). Si el libro se eligió desde Google Books, también guarda `portada` (la dirección de la imagen de tapa) y `googleId` (el identificador del libro en Google Books, que se usa para pedir la sinopsis en "Ver más"). Las reglas de Firestore hacen que cada usuario solo pueda ver y modificar sus propios libros, validan cada campo y no permiten agregar campos que no estén en esta lista.

## API externa: Google Books

A pedido del profesor, la app usa la **API de Google Books** para buscar libros en español. Antes de programar hice una prueba mínima: sin clave, Google Books respondía "Quota exceeded" (cupo compartido agotado), y Open Library funcionaba pero traía títulos en inglés y casi sin sinopsis. Elegí Google Books con una **clave propia gratuita** (1000 búsquedas por día), creada en Google Cloud dentro del mismo proyecto de Firebase y limitada para que **solo sirva para la Books API** y **solo funcione desde mi página de Vercel y mi compu**. La clave está en el `.env` (`VITE_GOOGLE_BOOKS_API_KEY`) y en las variables de Vercel, nunca en el código del repositorio. Todo el código de la API está en `src/googleBooks.js` y usa `fetch`.

## Herramientas de IA utilizadas

Usé **ChatGPT** y **Claude**. Les pedí ayuda para entender y seguir los pasos del proyecto (crear la app, conectar Firebase, subirla a GitHub y publicarla en Vercel), porque me perdí varias veces en el proceso. Con Claude también revisé si el trabajo cumplía con la consigna, corregí errores, publiqué la app en Vercel paso a paso, elegí y conecté la API de Google Books, y fui ajustando la búsqueda a partir de los problemas que encontraba al probarla.

### Ejemplos de instrucciones dadas a la IA

1. Pedido inicial, aproximado: "Quiero hacer una app de libros, para llevar la cuenta de los libros, para personas a las que les gusta leer."
2. "Revisá el trabajo que hice hasta ahora y decime si cumple con la consigna."
3. "Ayudame a realizar todos los cambios necesarios para que funcione."
4. Para la versión final: "Quiero sacar el botón de agregar el libro y que en la parte de estado de lectura estén dos botones, uno de 'Quiero leer' y otro de 'Leído', para que no se hagan tantos pasos."
5. Al publicar las reglas: "¿Qué reglas son las que tengo que pegar? ¿Dónde? ¿Las sumo a las que ya están o borro las que están y pego unas nuevas?"
6. Para la API: "El profesor me pidió usar una API sobre libros. ¿Cómo puedo llegar a usar una API? ¿Qué funciones podríamos sumar?"
7. Al probar el buscador: "Si ya escribo bien y voy borrando hacia atrás, por ejemplo con *Los siete maridos de Evelyn Hugo*, solo había borrado la 'o' de 'Hugo' y la búsqueda ahí no funciona bien. ¿Por qué?"
8. Sobre el diseño de los mensajes: "Cuando dice que el libro fue eliminado, el mensaje aparece arriba, donde se agregan los libros, y yo lo eliminé desde abajo. Me parece más apropiado que aparezca abajo y en rojo."

## Por qué la app tiene esta apariencia

Elegí este diseño porque quería algo sobrio y simple. La organización en tarjetas me parece más fácil de leer: cada libro tiene su propio espacio, con su estado, título, autor y acciones. Solo quería transmitir orden y que la información fuera fácil de encontrar. Por eso usé pocos colores, una letra con serifa solo para los títulos y una letra simple para el resto del texto. Quería que la persona sintiera que todo está organizado y que es fácil de usar, sin muchas pestañas o secciones que no tengan uso real para lo que es la página.

Me inspiré en **Goodreads**, una app de libros que uso, pero quise quedarme solo con lo esencial: guardar libros, marcar si los leí y encontrarlos rápido. Goodreads tiene muchas secciones y opciones que no me gustan, y mi idea era una versión más simple y ordenada.

En la versión final cambié la paleta a **verde acuarela**, inspirada en una imagen de fondo que encontré. Pensé en usar flores, pero lo descarté porque iban a recargar la página. La acuarela verde es suave, da calma y no compite con los libros. Sumé una **hoja de otoño** como logo e **íconos de libros en acuarela** para los contadores: sus tonos cálidos contrastan con el verde, como un libro sobre el pasto en otoño.

También simplifiqué el uso: el formulario para agregar un libro quedó primero, se guarda con un solo toque ("Quiero leer" o "Leído") y los contadores de la colección sirven para filtrar, así no hay botones repetidos. Con la API, las tarjetas ahora muestran la portada real de cada libro, lo que hace la colección más visual sin agregar pantallas nuevas.

## Dificultades y soluciones

| Dificultad | Solución |
|---|---|
| Los libros nuevos no aparecían al filtrar por usuario | Guardar el `ownerId` al agregar cada libro |
| La base no puede quedar abierta | Reglas de Firestore por usuario y con validación de campos |
| Cada vez que entraba se creaba un usuario anónimo nuevo y todos veían los mismos libros | La app leía todos los libros de la colección. Se agregó el campo `ownerId` y la consulta pasó a traer solo los libros del usuario; además, las reglas de Firestore lo exigen |
| Vercel no mostraba el repositorio de GitHub | La cuenta de Vercel se había creado con Gmail. Se autorizó e instaló la app de Vercel en GitHub, solo para el repositorio mi-biblioteca |
| Google Books sin clave respondía "Quota exceeded" | Se creó una clave propia gratuita, limitada a la Books API y a mis sitios |
| Al escribir palabras a medias ("el princi", "Evelyn Hug") aparecían libros que no tenían nada que ver | Google Books busca palabras completas. Se ordenan los resultados según cuánto se parece el título a lo escrito (la última palabra cuenta aunque esté a medias) y se sacan los resultados sin autor, repetidos o antiguos |
| Con títulos muy comunes ("La sombra") no aparecía el libro buscado | El campo Autor también se usa para buscar (`inauthor:`), así se encuentra el libro justo |
| Los géneros llegaban en inglés o vacíos | Lista de traducciones al español; si la búsqueda no trae género, se pide al detalle del libro; si Google no lo tiene, queda vacío para escribirlo a mano |
| El aviso de "libro eliminado" aparecía lejos de donde se eliminó | Los mensajes de la colección se muestran en la colección, el de eliminar en rojo |
