// ============================================================
// shareFormat — Convierte la lista de compras en texto plano
// listo para pegar en WhatsApp (o cualquier chat).
// ============================================================

import { ShoppingItem } from '../types';

/**
 * Arma el mensaje de texto que se comparte por WhatsApp a partir
 * de los ítems de la lista activa.
 *
 * Formato: título en negrita (sintaxis de WhatsApp: *texto*) seguido de
 * los ítems pendientes con checkbox vacío. Los ya comprados (tachados en
 * la UI) se excluyen a propósito — compartir solo tiene sentido para lo
 * que todavía falta conseguir.
 */
export function formatListForSharing(items: ShoppingItem[]): string {
  const pending = items.filter((i) => !i.purchased);

  const lines = [`*🛒 Lista del Súper* (${pending.length} ítems)`, ''];
  pending.forEach((item) => lines.push(`☐ ${item.name}`));

  return lines.join('\n');
}
