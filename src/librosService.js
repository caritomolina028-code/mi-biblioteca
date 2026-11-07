// Todas las operaciones con Firestore están en este archivo.
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { db } from './firebase'

const librosRef = collection(db, 'libros')

// CONSULTAR: escucha en tiempo real los libros del usuario.
// Devuelve una función para dejar de escuchar.
export function escucharLibros(uid, alRecibir, alFallar) {
  const consulta = query(librosRef, where('ownerId', '==', uid))
  return onSnapshot(
    consulta,
    (snapshot) => {
      const libros = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }))
      alRecibir(libros)
    },
    alFallar
  )
}

// AGREGAR: guarda el libro con el uid del dueño (lo exigen las reglas)
export function agregarLibro(uid, datosLibro) {
  return addDoc(librosRef, { ...datosLibro, ownerId: uid })
}

// MODIFICAR: cambia solo los campos que se pasan
export function actualizarLibro(id, cambios) {
  return updateDoc(doc(db, 'libros', id), cambios)
}

// ELIMINAR
export function eliminarLibro(id) {
  return deleteDoc(doc(db, 'libros', id))
}
