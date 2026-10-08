const $ = (selector) => document.querySelector(selector);

let scanner = null;
let locked = false;
let starting = false;

$("#modeBadge").textContent = PREMIERE_API.configured ? "REALTIME ONLINE" : "DEMO MODE";

function setHelp(message, isError = false) {
  const help = $("#cameraHelp");
  help.textContent = message;
  help.classList.toggle("is-error", isError);
}

function createScanner() {
  if (scanner) return scanner;

  const options = { verbose: false };
  if (window.Html5QrcodeSupportedFormats) {
    options.formatsToSupport = [Html5QrcodeSupportedFormats.QR_CODE];
  }
  scanner = new Html5Qrcode("reader", options);
  return scanner;
}

async function stop() {
  if (scanner?.isScanning) {
    try {
      await scanner.stop();
    } catch {
      // The result screen can still open if a browser already released the camera.
    }
  }
}

async function process(raw) {
  if (locked) return;
  locked = true;

  try {
    const result = await PREMIERE_API.checkIn(raw);
    const ticket = PREMIERE.tickets.find(
      (item) => item.ticketId === (result.ticket_id || result.ticketId),
    ) || result;
    const teacher = ticket.type === "teacher" || ticket.ticket_type === "teacher";

    await stop();

    const pane = $("#scanResult");
    pane.className = `scan-result ${result.status} ${
      teacher && result.status === "valid" ? "teacher" : ""
    }`;
    $("#resultKicker").textContent = teacher && result.status === "valid"
      ? "SPECIAL ACCESS DETECTED"
      : result.status === "valid"
        ? "TICKET VERIFIED"
        : result.status === "used"
          ? "DUPLICATE SCAN"
          : "ACCESS DENIED";
    $("#resultTitle").textContent = result.status === "valid"
      ? "ACCESS GRANTED"
      : result.status === "used"
        ? "ALREADY CHECKED IN"
        : "INVALID TICKET";
    $("#resultName").textContent = ticket.name || "UNKNOWN PASS";
    $("#resultMeta").textContent = ticket.name
      ? `${teacher ? "HONORED GUEST" : ticket.role || "GUEST"} · № ${ticket.number || "—"}`
      : result.ticket_id || "Код не знайдено";
    $("#teacherSecret").hidden = !(teacher && result.status === "valid");
    pane.hidden = false;
  } catch (error) {
    locked = false;
    setHelp(`Не вдалося перевірити квиток: ${error.message}`, true);
  }
}

async function cameraSelection() {
  const cameras = await Html5Qrcode.getCameras();
  const rearCamera = cameras.find((camera) =>
    /back|rear|environment|задн|основн/i.test(camera.label),
  );

  if (rearCamera) return { deviceId: { exact: rearCamera.id } };
  return { facingMode: "environment" };
}

async function start() {
  if (starting || scanner?.isScanning) return;
  if (!window.Html5Qrcode) {
    setHelp("Модуль QR-сканера не завантажився. Оновіть сторінку.", true);
    return;
  }
  if (!window.isSecureContext && location.hostname !== "localhost") {
    setHelp("Камера працює лише через захищене HTTPS-посилання.", true);
    return;
  }

  starting = true;
  locked = false;
  try {
    const activeScanner = createScanner();
    const camera = await cameraSelection();
    await activeScanner.start(
      camera,
      {
        fps: 15,
        qrbox: (width, height) => {
          const size = Math.floor(Math.min(width, height) * 0.78);
          return { width: size, height: size };
        },
        aspectRatio: 1,
        disableFlip: false,
        experimentalFeatures: { useBarCodeDetectorIfSupported: true },
      },
      process,
      () => {},
    );
    $("#startScanner").hidden = true;
    setHelp("Камера активна · тримайте QR-код нерухомо в рамці");
  } catch (error) {
    const denied = /NotAllowed|Permission|permission|denied/i.test(
      `${error?.name || ""} ${error?.message || error || ""}`,
    );
    setHelp(
      denied
        ? "Немає доступу до камери. Дозвольте камеру в налаштуваннях браузера або виберіть «Сканувати з фото»."
        : "Камеру не вдалося запустити. Спробуйте «Сканувати з фото».",
      true,
    );
  } finally {
    starting = false;
  }
}

async function scanImage(file) {
  if (!file) return;
  if (!window.Html5Qrcode) {
    setHelp("Модуль QR-сканера не завантажився. Оновіть сторінку.", true);
    return;
  }

  locked = false;
  await stop();
  try {
    setHelp("Розпізнаємо QR-код на фото…");
    const raw = await createScanner().scanFile(file, true);
    await process(raw);
  } catch {
    locked = false;
    setHelp("QR-код на фото не знайдено. Спробуйте чіткіше фото без відблисків.", true);
  }
}

PREMIERE.tickets.forEach((ticket) => {
  const button = document.createElement("button");
  button.textContent = `${ticket.number} · ${ticket.name}`;
  button.onclick = () => process(PREMIERE.qrPayload(ticket));
  $("#testTickets").appendChild(button);
});

$("#startScanner").onclick = start;
$("#qrImage").onchange = async (event) => {
  await scanImage(event.target.files?.[0]);
  event.target.value = "";
};
$("#scanAgain").onclick = async () => {
  $("#scanResult").hidden = true;
  locked = false;
  await start();
};

const query = new URLSearchParams(location.search);
const direct = query.get("t") || query.get("ticket");
if (direct) process(location.href);
