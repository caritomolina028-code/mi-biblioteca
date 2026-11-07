# Informe – TP 2 Desarrollo Frontend II

**Alumna:** Carolina Molina

## Enlaces

- **App (Vercel):** https://mi-biblioteca-zeta.vercel.app/
- **Repositorio (GitHub):** https://github.com/caritomolina028-code/mi-biblioteca
- **Bitácora:** BITACORA.md en el repositorio
- **Mini video:** [completar]

## Idea y público

Mi biblioteca es una aplicación para personas a las que les gusta leer. Sirve para dos cosas:

- **No olvidarse de los libros que quieren leer:** cuando alguien encuentra un libro que le interesa, porque se lo recomendó un conocido, lo vio en un video o leyó una reseña, lo puede guardar en la app como "Quiero leer".
- **Llevar un listado de los libros que ya leyó**, marcándolos como "Leído".

## Funciones implementadas

- Agregar un libro con título, autor, género y estado.
- Ver la colección, con contadores de libros totales, leídos y por leer.
- Marcar un libro como leído o pendiente.
- Editar los datos de un libro.
- Eliminar un libro (con confirmación).
- Buscar por título o autor y filtrar por estado.
- Mensajes de carga, éxito y error; validación de campos obligatorios.
- Diseño adaptado a computadora y celular.

## Información guardada en Firebase

Colección `libros` en Cloud Firestore. Cada documento tiene `titulo`, `autor`, `genero`, `estado` y `ownerId` (el identificador del usuario anónimo). Las reglas de Firestore hacen que cada usuario solo pueda ver y modificar sus propios libros.

## Herramientas de IA utilizadas

Usé **ChatGPT** y **Claude**. Les pedí ayuda para entender y seguir los pasos del proyecto (crear la app, conectar Firebase, subirla a GitHub y publicarla en Vercel), porque me perdí varias veces en el proceso. Con Claude también revisé si el trabajo cumplía con la consigna, corregí errores y publiqué la app en Vercel paso a paso.

### Ejemplos de instrucciones dadas a la IA

1. Pedido inicial, aproximado: "Quiero hacer una app de libros, para llevar la cuenta de los libros, para personas a las que les gusta leer."
2. "Revisá el trabajo que hice hasta ahora y decime si cumple con la consigna."
3. "Ayudame a realizar todos los cambios necesarios para que funcione."
4. Al publicar las reglas: "¿Qué reglas son las que tengo que pegar? ¿Dónde? ¿Las sumo a las que ya están o borro las que están y pego unas nuevas?"

## Por qué la app tiene esta apariencia

Elegí este diseño porque quería algo sobrio y simple. La organización en tarjetas me parece más fácil de leer: cada libro tiene su propio espacio, con su estado, título, autor y acciones. Solo quería transmitir orden y que la información fuera fácil de encontrar. Quería que la persona sintiera que todo está organizado y que es fácil de usar, sin muchas pestañas o secciones que no tengan uso real para lo que es la página.

Me inspiré en **Goodreads**, una app de libros que uso, pero quise quedarme solo con lo esencial: guardar libros, marcar si los leí y encontrarlos rápido. Goodreads tiene muchas secciones y opciones que no me gustan, y mi idea era una versión más simple y ordenada. Por eso usé pocos colores (beige y marrón, tonos cálidos que recuerdan al papel), una letra con serifa solo para los títulos y una letra simple para el resto del texto.

## Dificultades y soluciones

| Dificultad | Solución |
|---|---|
| Los libros nuevos no aparecían al filtrar por usuario | Guardar el `ownerId` al agregar cada libro |
| La base no puede quedar abierta | Reglas de Firestore por usuario y con validación de campos |
| Cada vez que entraba se creaba un usuario anónimo nuevo y todos veían los mismos libros | La app leía todos los libros de la colección. Se agregó el campo `ownerId` y la consulta pasó a traer solo los libros del usuario; además, las reglas de Firestore lo exigen |
| Vercel no mostraba el repositorio de GitHub | La cuenta de Vercel se había creado con Gmail. Se autorizó e instaló la app de Vercel en GitHub, solo para el repositorio mi-biblioteca |
