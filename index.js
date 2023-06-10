const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} = require("@whiskeysockets/baileys");
const { open } = require("./lib/connections");
const { join } = require("path");
const P = require("pino");

const logging = require("./lib/logging");

const connectReybotWhatsapp = async () => {
  let auth;
  let waWeb;
  try {
    auth = await useMultiFileAuthState(join(__dirname, "./auth"));
    waWeb = await fetchLatestBaileysVersion();
  } catch (err) {
    logging("error", "Session", err);
  }
  const { state, saveCreds } = auth;
  const rkwpbot = makeWASocket({
    version: waWeb.version,
    printQRInTerminal: true,
    logger: P({ level: "silent" }),
    browser: ["ReybotVIP", "Firefox", "2.0.0"],
    auth: state,
    generateHighQualityLinkPreview: true,
  });
  rkwpbot.ev.on("messages.upsert", (m) => {
    const msg = m.messages[0];
    if (msg.key.remoteJid === "status@broadcast") return;
    const isGroup = msg.key.remoteJid.endsWith("@g.us");
    require("./handler/messages")({
      rkwpbot,
      msg,
      isGroup,
      connectReybotWhatsapp,
    });
  });
  rkwpbot.ev.on("group-participants.update", (g) => {
    require("./handler/groups")({ rkwpbot, g });
  });
  rkwpbot.ev.on("call", (c) => {
    require("./handler/calls")({ rkwpbot, c });
  });
  rkwpbot.ev.on("creds.update", saveCreds);
  rkwpbot.ev.on("connection.update", async ({ connection }) => {
    if (connection === "close") connectReybotWhatsapp();
    if (connection === "connecting") {
      logging("info", "Connection", "Connecting");
    }
    if (connection === "open") {
      open(rkwpbot);
    }
  });
};

connectReybotWhatsapp();