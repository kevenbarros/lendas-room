import express from "express";
import cors from "cors";
import { buildMatchPrompt } from "./promptBuilder.js";
import { callOllama } from "./ollama.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ success: true, service: "lendas-match-server" });
});

app.post("/api/match", async (req, res) => {
  const { players, numGroups, playersPerGroup } = req.body || {};

  if (!Array.isArray(players) || players.length === 0) {
    return res
      .status(400)
      .json({ success: false, error: "players deve ser um array não vazio." });
  }
  if (!Number.isFinite(numGroups) || numGroups < 1) {
    return res
      .status(400)
      .json({ success: false, error: "numGroups inválido." });
  }
  if (!Number.isFinite(playersPerGroup) || playersPerGroup < 2) {
    return res
      .status(400)
      .json({ success: false, error: "playersPerGroup inválido." });
  }

  const prompt = buildMatchPrompt(players, { numGroups, playersPerGroup });

  try {
    const response = await callOllama(prompt);
    res.json({ success: true, response });
  } catch (err) {
    console.error("Erro chamando Ollama:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Erro na IA local",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🔌 Match server rodando em http://localhost:${PORT}`);
  console.log(`   POST /api/match — gerar grupos via Ollama`);
});
