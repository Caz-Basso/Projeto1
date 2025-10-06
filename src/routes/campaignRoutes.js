const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../db/campaign.json");

/**
 * @swagger
 * components:
 *   schemas:
 *     Campaign:
 *       type: object
 *       required:
 *         - id
 *         - supplier_id
 *         - name
 *         - start_date
 *         - end_date
 *         - discount_percentage
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único da campanha
 *         supplier_id:
 *           type: string
 *           description: ID do fornecedor vinculado à campanha
 *         name:
 *           type: string
 *           description: Nome da campanha promocional
 *         start_date:
 *           type: string
 *           description: Data e hora de início da campanha (YYYY-MM-DD HH:MM:SS)
 *         end_date:
 *           type: string
 *           description: Data e hora de término da campanha (YYYY-MM-DD HH:MM:SS)
 *         discount_percentage:
 *           type: number
 *           description: Percentual de desconto aplicado na campanha
 *       example:
 *         id: "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
 *         supplier_id: "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
 *         name: "Black Friday"
 *         start_date: "2023-08-15 16:00:00"
 *         end_date: "2023-08-20 23:59:59"
 *         discount_percentage: 20
 */

/**
 * @swagger
 * tags:
 *   name: Campanhas
 *   description: API de gerenciamento de Campanhas (Por Taily Vieira)
 */

/**
 * @swagger
 * /campaigns:
 *   get:
 *     summary: Listar todas as campanhas
 *     tags: [Campanhas]
 *     responses:
 *       200:
 *         description: Lista de campanhas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Campaign'
 */

/**
 * @swagger
 * /campaigns:
 *   post:
 *     summary: Criar uma nova campanha
 *     tags: [Campanhas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       201:
 *         description: Campanha criada com sucesso
 */

/**
 * @swagger
 * /campaigns/{id}:
 *   get:
 *     summary: Buscar campanha por ID
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da campanha
 *     responses:
 *       200:
 *         description: Campanha encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: Campanha não encontrada
 */

/**
 * @swagger
 * /campaigns/nome/{nome}:
 *   get:
 *     summary: Buscar campanha por nome
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: nome
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome da campanha
 *     responses:
 *       200:
 *         description: Campanha encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Campaign'
 *       404:
 *         description: Campanha não encontrada
 */

/**
 * @swagger
 * /campaigns/{id}:
 *   put:
 *     summary: Atualizar campanha por ID
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da campanha
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Campaign'
 *     responses:
 *       200:
 *         description: Campanha atualizada com sucesso
 */

/**
 * @swagger
 * /campaigns/{id}:
 *   delete:
 *     summary: Excluir campanha por ID
 *     tags: [Campanhas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da campanha
 *     responses:
 *       204:
 *         description: Campanha excluída com sucesso
 */

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

router.get("/:id", (req, res) => {
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

module.exports = router;
