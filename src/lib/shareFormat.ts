// ============================================================
// shareFormat — Convierte la lista de compras en texto plano
// listo para pegar en WhatsApp (o cualquier chat).
// ============================================================

import { ShoppingItem } from '../types';

/**
 * Arma el mensaje de texto que se comparte por WhatsApp a partir
 * de los ítems de la lista activa.
 *
 * Formato: título en negrita (sintaxis de WhatsApp: *texto*), pendientes
 * primero con checkbox vacío, comprados al final tachados (~texto~) para
 * no perder contexto de lo que ya se resolvió.
 */
export function formatListForSharing(items: ShoppingItem[]): string {
  const pending = items.filter((i) => !i.purchased);
  const purchased = items.filter((i) => i.purchased);

  const lines = [`*🛒 Lista del Súper* (${items.length} ítems)`, ''];

  pending.forEach((item) => lines.push(`☐ ${item.name}`));

  if (purchased.length > 0) {
    lines.push('', `_Comprado (${purchased.length})_`);
    purchased.forEach((item) => lines.push(`✅ ~${item.name}~`));
  }

  return lines.join('\n');
}
