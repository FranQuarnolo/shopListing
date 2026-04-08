// ============================================================
// Tipos centrales de la aplicación
// Aquí definimos las estructuras de datos que se usan en toda la app.
// TypeScript nos permite tipar estos objetos para evitar errores.
// ============================================================

/**
 * Representa un producto dentro de la lista de compras.
 * Cada campo tiene un tipo explícito para que TypeScript
 * nos avise si intentamos asignar un valor incorrecto.
 */
export interface ShoppingItem {
  id: string;        // Identificador único generado con uuid
  name: string;      // Nombre del producto
  purchased: boolean; // true = ya fue comprado
}

/**
 * Representa una lista guardada en el historial.
 * Almacena los ítems tal como estaban al momento de guardar.
 */
export interface SavedList {
  id: string;
  title: string;
  date: string;  // Fecha en formato ISO 8601 (ej: "2024-04-08T10:00:00.000Z")
  total: number; // Monto ingresado manualmente por el usuario
  items: ShoppingItem[];
}

/**
 * Opciones de ordenamiento para el historial de compras.
 * Es un "union type": solo puede ser uno de estos 4 valores.
 */
export type SortOrder = 'date-desc' | 'date-asc' | 'name-asc' | 'total-desc';
