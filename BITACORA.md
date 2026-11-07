# Bitácora – Mi biblioteca

## Idea inicial

- **Qué es:** una biblioteca personal para registrar libros leídos y pendientes.
- **Necesidad:** [completar con tus palabras: por qué la necesitás o quién la necesita]
- **Público:** [completar]
- **Información guardada:** título, autor, género, estado de lectura y el usuario dueño de cada libro.

---

## Versión 1 – Primera versión funcional (commit "version1")

**Qué se hizo**
- Proyecto creado con React + Vite.
- Interfaz con formulario, estadísticas, buscador, filtros y tarjetas de libros.
- Conexión con Firestore: agregar, consultar, modificar y eliminar libros.

**Diseño:** [completar: por qué elegiste colores cálidos, la tipografía Playfair Display para títulos, etc.]

**Uso de IA:** [completar: qué herramienta usaste y qué le pediste]

**Pruebas:** [completar: qué probaste y cómo]

**Dificultades:** [completar]

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
- [ ] Agregar un libro, verlo en Firestore → Datos.
- [ ] Recargar y comprobar que sigue.
- [ ] Editarlo y cambiar el estado; ver el cambio en Firestore.
- [ ] Eliminarlo y comprobar que desaparece de Firestore.
- [ ] Abrir en ventana de incógnito: no aparecen los libros de la otra ventana.
- [ ] Probar en el celular.

**Verificación en Vercel:** [completar: el despliegue quedó en Ready y se vio el cambio en la URL]

**Capturas:** [agregar]

---

## Versión 3 – Versión final

**Qué cambió:** [completar]

**Por qué:** [completar]

**Pruebas y verificación en Vercel:** [completar]

**Capturas:** [agregar]
