const express = require("express");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "123456";

// Ruta para verificar que el servidor está vivo
app.get("/", (req, res) => {
  console.log("\n=== GET RECIBIDO ===");
  console.log("Query:", req.query);

  const mode = req.query["hub.mode"];
  const challenge = req.query["hub.challenge"];
  const token = req.query["hub.verify_token"];

  console.log("Mode:", mode);
  console.log("Token recibido:", token);
  console.log("Token esperado:", VERIFY_TOKEN);
  console.log("Challenge:", challenge);

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFICADO");
    return res.status(200).send(challenge);
  }

  // Si alguien abre la URL desde el navegador
  if (!mode) {
    return res.status(200).send("Servidor funcionando");
  }

  console.log("❌ TOKEN INCORRECTO");
  return res.sendStatus(403);
});

// Recepción de eventos de WhatsApp
app.post("/", (req, res) => {
  console.log("\n=== WEBHOOK RECIBIDO ===");
  console.log(new Date().toISOString());
  console.log(JSON.stringify(req.body, null, 2));

  res.sendStatus(200);
});

// Captura errores inesperados
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
  console.log(`🔑 VERIFY_TOKEN: ${VERIFY_TOKEN}`);
});