import { OrderForm } from './types';
import { formatPrice } from './data';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export function generateWhatsAppMessage(
  items: CartItem[],
  orderForm: OrderForm,
  totalPrice: number
): string {
  const itemsList = items.map(item => 
    `• ${item.name} (${item.quantity}x) - ${formatPrice(item.price * item.quantity)}`
  ).join('\n');

  const message = `🧁 *Pesanan DapurMama* 🧁

*Detail Pesanan:*
${itemsList}

*Total: ${formatPrice(totalPrice)}*

*Data Pemesan:*
👤 Nama: ${orderForm.name}
📞 No. WA: ${orderForm.phone}
📍 Alamat: ${orderForm.address}
${orderForm.notes ? `📝 Catatan: ${orderForm.notes}` : ''}

Terima kasih sudah mempercayai DapurMama! 💕`;

  return encodeURIComponent(message);
}

export function openWhatsApp(message: string, phoneNumber: string = '628123456789'): void {
  const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
  window.open(url, '_blank');
}