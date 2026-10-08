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
  {
    ticketId: "PT-2026-T001",
    name: "Ференц Мільо",
    aliases: [
      "Ференц Мільо",
      "Ференц",
      "Мільо",
      "Мільо Ференц",
      "Ференц Міло",
      "Міло Ференц"
    ],
    number: "T01",
    type: "teacher",
    role: "HONORED GUEST"
  },

  {
    ticketId: "PT-2026-T002",
    name: "Андрій Бендус",
    aliases: [
      "Андрій Бендус",
      "Андрій",
      "Бендус",
      "Бендус Андрій"
    ],
    number: "T02",
    type: "teacher",
    role: "HONORED GUEST"
  },

  {
    ticketId: "PT-2026-T003",
    name: "Рувім Друзь",
    aliases: [
      "Рувім Друзь",
      "Рувім",
      "Друзь",
      "Друзь Рувім"
    ],
    number: "T03",
    type: "teacher",
    role: "HONORED GUEST"
  }
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
