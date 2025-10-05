import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = path.join(__dirname, "campaign.json");

function readFile() {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.warn(`Arquivo ${path.basename(filePath)} não encontrado. Criando um novo.`);
      return [];
    }
    console.error("Erro ao ler o arquivo:", err);
    return [];
  }
}

function saveFile(data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Erro ao salvar o arquivo:", err);
  }
}

router.get("/", (req, res) => {
  const data = readFile();
  res.json(data);
});

router.get("/id/:id", (req, res) => {
  const data = readFile();
  const item = data.find(c => c.id == req.params.id);
  if (!item) return res.status(404).json({ message: "Campanha não encontrada" });
  res.json(item);
});

router.get("/nome/:nome", (req, res) => {
  const data = readFile();
  const results = data.filter(c =>
    c.name.toLowerCase().includes(req.params.nome.toLowerCase())
  );
  res.json(results);
});

router.post("/", (req, res) => {
  const data = readFile();
  const nova = { id: Date.now().toString(), ...req.body };
  data.push(nova);
  saveFile(data);
  res.status(201).json(nova);
});

router.put("/:id", (req, res) => {
  const data = readFile();
  const index = data.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Campanha não encontrada" });

  data[index] = { ...data[index], ...req.body, id: data[index].id };
  saveFile(data);
  res.json(data[index]);
});

router.delete("/:id", (req, res) => {
  const data = readFile();
  const novoArray = data.filter(c => c.id != req.params.id);

  if (data.length === novoArray.length)
    return res.status(404).json({ message: "Campanha não encontrada" });

  saveFile(novoArray);
  res.json({ message: "Campanha removida com sucesso" });
});

router.get("/search/:name", (req, res) => {
  const { name } = req.params;
  const campaigns = readFile();

  const results = campaigns.filter(c =>
    c.name.toLowerCase().includes(name.toLowerCase())
  );

  if (results.length === 0) {
    return res.status(404).json({ message: "Nenhuma campanha encontrada com esse nome." });
  }
  res.json(results);
});

export default router;
