import { OrderForm } from "./types";
import { formatPrice } from "./data";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  poSessionId?: string;
}

export function generateWhatsAppMessage(
  items: CartItem[],
  orderForm: OrderForm,
  totalPrice: number,
  orderNumber?: string,
  poSessionName?: string
): string {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Header dengan emoji dan order number yang lebih prominent
  let header = `🧾 *PESANAN BARU*\n📅 ${currentDate}\n`;

  if (orderNumber) {
    header += `📋 *No. Pesanan: ${orderNumber}*\n`;
  }

  header += `\n`;

  // PO Session info jika ada
  const poInfo = poSessionName ? `🎯 *Pre-Order:* ${poSessionName}\n\n` : "";

  // Data pelanggan dengan format rapi
  const customerInfo =
    `👤 *DATA PELANGGAN*\n` +
    `┣ Nama: ${orderForm.name}\n` +
    `┣ Telepon: ${orderForm.phone}\n` +
    `┗ Alamat: ${orderForm.address}\n` +
    (orderForm.notes ? `💬 *Catatan:* ${orderForm.notes}\n` : "") +
    `\n`;

  // Detail pesanan dengan format tabel
  const itemsHeader = `🛒 *DETAIL PESANAN*\n`;
  const itemsList = items
    .map((item, index) => {
      const itemTotal = formatPrice(item.price * item.quantity);
      const unitPrice = formatPrice(item.price);
      const poTag = item.poSessionId ? " 🎯" : "";

      return (
        `${index + 1}. ${item.name}${poTag}\n` +
        `   ${item.quantity}x @ ${unitPrice} = ${itemTotal}`
      );
    })
    .join("\n");

  // Total dengan garis pemisah
  const separator = `${"─".repeat(25)}\n`;
  const totalSection = `${separator}💰 *TOTAL: ${formatPrice(
    totalPrice
  )}*\n${separator}`;

  // Footer dengan instruksi tracking
  let footer = `\n🙏 Terima kasih atas pesanannya!\n📞 Kami akan segera menghubungi Anda untuk konfirmasi.`;

  if (orderNumber) {
    footer +=
      `\n\n🔍 *Lacak pesanan Anda:*\n` +
      `Kunjungi: dapurmama.com/track\n` +
      `Masukkan: ${orderNumber}`;
  }

  return (
    header +
    poInfo +
    customerInfo +
    itemsHeader +
    itemsList +
    "\n" +
    totalSection +
    footer
  );
}

export function openWhatsApp(
  message: string,
  phoneNumber: string = "6289639011775"
): void {
  const encodedMessage = encodeURIComponent(message);
  const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
  window.open(url, "_blank");
}
