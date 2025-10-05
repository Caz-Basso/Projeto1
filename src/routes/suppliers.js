import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();

// ✅ Corrige __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Caminho correto para o arquivo suppliers.json
const filePath = path.join(__dirname, "..", "suppliers.json");

// ---------------------- FUNÇÕES DE ARQUIVO ----------------------

// Ler arquivo
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

// Salvar arquivo
function saveFile(data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Erro ao salvar o arquivo:", err);
  }
}

// ---------------------- ROTAS ----------------------

// ✅ GET - Listar todos os fornecedores
router.get("/", (req, res) => {
  const data = readFile();
  res.json(data);
});

// ✅ GET - Buscar fornecedor por ID
router.get("/id/:id", (req, res) => {
  const data = readFile();
  const item = data.find(c => c.id == req.params.id);
  if (!item) return res.status(404).json({ message: "Fornecedor não encontrado" });
  res.json(item);
});

// ✅ GET - Buscar fornecedor por nome
router.get("/nome/:nome", (req, res) => {
  const data = readFile();
  const results = data.filter(c =>
    c.name.toLowerCase().includes(req.params.nome.toLowerCase())
  );
  res.json(results);
});

// ✅ POST - Criar novo fornecedor
router.post("/", (req, res) => {
  const data = readFile();
  const novo = { id: Date.now().toString(), ...req.body };
  data.push(novo);
  saveFile(data);
  res.status(201).json(novo);
});

// ✅ PUT - Atualizar fornecedor
router.put("/:id", (req, res) => {
  const data = readFile();
  const index = data.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Fornecedor não encontrado" });

  data[index] = { ...data[index], ...req.body, id: data[index].id };
  saveFile(data);
  res.json(data[index]);
});

// ✅ DELETE - Deletar fornecedor
router.delete("/:id", (req, res) => {
  const data = readFile();
  const novoArray = data.filter(c => c.id != req.params.id);

  if (data.length === novoArray.length)
    return res.status(404).json({ message: "Fornecedor não encontrado" });

  saveFile(novoArray);
  res.json({ message: "Fornecedor removido com sucesso" });
});

export default router;
