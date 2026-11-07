# Bitácora – Mi biblioteca

## Idea inicial

- **Qué es:** una biblioteca personal para registrar libros leídos y pendientes.
- **Necesidad:** muchas veces encontramos un libro que nos interesa (por la recomendación de un conocido, un video o una reseña) y después nos olvidamos de cuál era. La app permite guardarlo para leerlo más adelante y, además, llevar la lista de los libros ya leídos.
- **Público:** personas a las que les gusta leer.
- **Información guardada:** título, autor, género, estado de lectura y el usuario dueño de cada libro.

---

## Versión 1 – Primera versión funcional (commit "version1")

**Qué se hizo**
- Proyecto creado con React + Vite.
- Interfaz con formulario, estadísticas, buscador, filtros y tarjetas de libros.
- Conexión con Firestore: agregar, consultar, modificar y eliminar libros.

**Diseño:** quería algo sobrio y simple, que transmitiera orden y donde la información fuera fácil de encontrar. Por eso elegí tarjetas para cada libro (me resultan más fáciles de leer), colores cálidos beige y marrón, la tipografía Playfair Display (con serifa) para los títulos y DM Sans para el resto. Me inspiré en Goodreads, una app que uso, pero sin tantas pestañas ni secciones que no hacen falta: la idea era que todo estuviera organizado y fuera fácil de usar.

**Uso de IA:** usé ChatGPT y Claude para que me guiaran en los pasos del proyecto. El pedido inicial fue, aproximadamente: "quiero hacer una app de libros, para llevar la cuenta de los libros, para personas a las que les gusta leer".

**Pruebas:** agregaba libros, los editaba y les cambiaba el estado, y me fijaba en Firebase (Firestore → Datos) que aparecieran y se actualizaran.

**Dificultades:** con los usuarios anónimos, cada vez que entraba se creaba un usuario nuevo, pero todos veían los mismos libros. Me costó encontrar el problema y hubo que hacer muchos cambios. Con ayuda de Claude se resolvió en la versión 2: cada libro guarda el usuario dueño (`ownerId`), la app solo consulta los libros de ese usuario y las reglas de Firestore lo exigen.

**Capturas:** [agregar capturas en docs/capturas/v1-...png]

---

## Versión 2 – Mejoras

**Qué cambió**
- Inicio de sesión anónimo: cada navegador tiene su propia biblioteca.
- Se guarda el `ownerId` en cada libro y solo se consultan los libros del usuario.
- Reglas de Firestore (`firestore.rules`): cada usuario solo accede a sus libros y se validan los campos.
- Indicador "Cargando tu biblioteca..." y mensaje distinto cuando la búsqueda no encuentra nada.
- Mensajes de éxito en verde y de error en rojo.
- El botón muestra "Guardando..." mientras se guarda.
- El código se separó en componentes (`Estadisticas`, `FormularioLibro`, `TarjetaLibro`) y un archivo con las operaciones de Firestore (`librosService.js`).
- Se borró código que no se usaba (registro con email, datos de prueba, imágenes de la plantilla).
- README con instrucciones.

**Dificultad encontrada:** al filtrar por `ownerId`, los libros nuevos no aparecían porque al agregarlos no se guardaba ese campo. Se resolvió agregando `ownerId` en `addDoc`.

**Pruebas**
- [x] Agregar un libro desde la URL publicada: aparece el mensaje "¡Libro agregado a tu biblioteca!" y el libro en la lista.
- [x] Recargar la página y comprobar que el libro sigue.
- [x] Marcarlo como leído y editarlo.
- [x] Eliminarlo.
- [x] Abrir la URL en una ventana de incógnito: la biblioteca aparece vacía, sin los libros de la otra ventana. Cada navegador tiene su propio usuario anónimo.
- [x] Probar en el celular: se agregó un libro y la app se ve y se usa bien en pantalla chica. Al volver a abrir el link en el celular, el libro sigue ahí (el celular conserva su propio usuario anónimo).

**Verificación en Vercel:** el proyecto se importó desde GitHub en Vercel, con las 4 variables `VITE_FIREBASE_*` cargadas. El despliegue terminó en "Deployed to Production" (18 segundos). En https://mi-biblioteca-zeta.vercel.app/ se probó agregar un libro, recargar, marcarlo como leído, editarlo y eliminarlo, y todo funcionó.

**Dificultades al publicar:** al crear la cuenta de Vercel se usó Gmail en lugar de GitHub, así que hubo que autorizar la app de Vercel en GitHub e instalarla solo para el repositorio mi-biblioteca. La ventana de autorización de GitHub se abrió detrás del navegador y parecía que Vercel estaba trabado; se resolvió encontrando esa ventana.

**Capturas:**

Despliegue en Vercel terminado ("Deployed to Production"):

![Despliegue de la versión 2 en Vercel](docs/capturas/v2-vercel-deploy.png)

App publicada con un libro agregado y el mensaje de éxito:

![App publicada con un libro cargado](docs/capturas/v2-app-libro.png)

Ventana de incógnito: la biblioteca aparece vacía, porque es otro usuario:

![Ventana de incógnito con la biblioteca vacía](docs/capturas/v2-incognito-vacia.png)

En el celular:

![App en el celular, inicio](docs/capturas/v2-celular-inicio.jpg)
![App en el celular, colección con un libro](docs/capturas/v2-celular-coleccion.jpg)

---

## Versión 3 – Versión final

**Qué cambió:** [completar]

**Por qué:** [completar]

**Pruebas y verificación en Vercel:** [completar]

**Capturas:** [agregar]
