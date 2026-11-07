# Informe – TP 2 Desarrollo Frontend II

**Alumna:** Carolina Molina

## Enlaces

- **App (Vercel):** [completar]
- **Repositorio (GitHub):** https://github.com/caritomolina028-code/mi-biblioteca
- **Bitácora:** BITACORA.md en el repositorio
- **Mini video:** [completar]

## Idea y público

Mi biblioteca es una aplicación para llevar el registro de los libros que leí y los que quiero leer.
[completar con tus palabras: qué necesidad resuelve y para quién es]

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

[completar: qué herramientas usaste (por ejemplo Claude, ChatGPT) y para qué]

### Ejemplos de instrucciones dadas a la IA

1. [completar con un ejemplo real]
2. "Revisá el trabajo que hice hasta ahora y decime si cumple con la consigna."
3. "Ayudame a realizar todos los cambios necesarios para que funcione."

## Por qué la app tiene esta apariencia

[completar con tus palabras: por qué colores cálidos tipo papel, la tipografía con serifa para los títulos, las tarjetas como libros, etc.]

## Dificultades y soluciones

| Dificultad | Solución |
|---|---|
| Los libros nuevos no aparecían al filtrar por usuario | Guardar el `ownerId` al agregar cada libro |
| La base no puede quedar abierta | Reglas de Firestore por usuario y con validación de campos |
| [completar] | [completar] |
