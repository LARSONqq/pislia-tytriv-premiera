/* ЄДИНЕ МІСЦЕ ДЛЯ VIP-СПИСКУ. Звичайні гості створюють квитки самостійно. */
window.PREMIERE = {
  vipGuests: [
    { ticketId:"PT-2026-T001-V8Q5", name:"Іван Петрович", number:"T01", type:"teacher", role:"HONORED GUEST" },
    { ticketId:"PT-2026-T002-C4N7", name:"Олена Василівна", number:"T02", type:"teacher", role:"HONORED GUEST" }
  ],
  demoGuests: [
    { ticketId:"PT-2026-G027-A7K2", name:"Марія Коваль", number:"027", type:"guest", role:"PREMIERE GUEST" }
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
