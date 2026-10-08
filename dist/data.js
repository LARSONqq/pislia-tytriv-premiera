/* ЄДИНЕ МІСЦЕ ДЛЯ VIP-СПИСКУ. Звичайні гості створюють квитки самостійно. */
window.PREMIERE = {
  event: {
    title: "Good Moodle Hunting",
    tagline: "Історія, яка не може залишити осторонь…",
    date: "9 жовтня 2026",
    ticketDate: "9 ЖОВТНЯ 2026",
    numericDate: "09 · 10 · 2026",
    doors: "09:50",
    start: "10:00",
    venue: "УБТС",
    room: "Нова бібліотека",
    address: "вул. Мельника, 21",
    dressCode: "ШО ПОПАЛО"
  },
  vipGuests: [
    { ticketId:"GMH-2026-VIP01-F9M2", name:"Мільо Ференц", number:"V01", type:"teacher", role:"HONORED GUEST" },
    { ticketId:"GMH-2026-VIP02-B4A7", name:"Бендус Андрій", number:"V02", type:"teacher", role:"HONORED GUEST" },
    { ticketId:"GMH-2026-VIP03-D8R3", name:"Друзь Рувім", number:"V03", type:"teacher", role:"HONORED GUEST" }
  ],
  demoGuests: [
    { ticketId:"GMH-2026-G001-DEMO", name:"Тестовий гість", number:"001", type:"guest", role:"PREMIERE GUEST" }
  ],
  get tickets() { return [...this.demoGuests, ...this.vipGuests]; },
  encodeName(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    bytes.forEach(byte => { binary += String.fromCharCode(byte); });
    return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
  },
  qrPayload(ticket) {
    const params = new URLSearchParams({ t:ticket.ticketId, n:this.encodeName(ticket.name), o:ticket.number });
    return `${location.origin}/scanner/?${params}`;
  }
};
