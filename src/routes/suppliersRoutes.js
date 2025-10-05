const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../db/suppliers.json");

/**
 * @swagger
 * components:
 *   schemas:
 *     Fornecedor:
 *       type: object
 *       required:
 *         - id
 *         - supplier_name
 *         - supplier_category
 *         - contact_email
 *         - phone_number
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: Identificador único do fornecedor
 *         supplier_name:
 *           type: string
 *           description: Nome do fornecedor
 *         supplier_category:
 *           type: string
 *           description: Categoria ou segmento do fornecedor
 *         contact_email:
 *           type: string
 *           description: Email de contato do fornecedor
 *         phone_number:
 *           type: string
 *           description: Telefone de contato do fornecedor
 *         status:
 *           type: string
 *           description: Situação atual do fornecedor (on = ativo, off = inativo)
 *       example:
 *         id: "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
 *         supplier_name: "Judite Heeler"
 *         supplier_category: "Informática, Segurança"
 *         contact_email: "j.heeler@gmail.com"
 *         phone_number: "48 9696 5858"
 *         status: "on"
 */

/**
 * @swagger
 * tags:
 *   name: Fornecedores
 *   description: API de gerenciamento de fornecedores
 */

/**
 * @swagger
 * /fornecedores:
 *   get:
 *     summary: Listar todos os fornecedores
 *     tags: [Fornecedores]
 *     responses:
 *       200:
 *         description: Lista de fornecedores retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Fornecedor'
 */

/**
 * @swagger
 * /fornecedores:
 *   post:
 *     summary: Criar um novo fornecedor
 *     tags: [Fornecedores]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fornecedor'
 *     responses:
 *       201:
 *         description: Fornecedor criado com sucesso
 */

/**
 * @swagger
 * /fornecedores/{id}:
 *   get:
 *     summary: Buscar fornecedor por ID
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do fornecedor
 *     responses:
 *       200:
 *         description: Fornecedor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fornecedor'
 *       404:
 *         description: Fornecedor não encontrado
 */

/**
 * @swagger
 * /fornecedores/{id}:
 *   put:
 *     summary: Atualizar fornecedor por ID
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do fornecedor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fornecedor'
 *     responses:
 *       200:
 *         description: Fornecedor atualizado com sucesso
 */

/**
 * @swagger
 * /fornecedores/{id}:
 *   delete:
 *     summary: Excluir fornecedor por ID
 *     tags: [Fornecedores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do fornecedor
 *     responses:
 *       204:
 *         description: Fornecedor excluído com sucesso
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

router.get("/id/:id", (req, res) => {
  const data = readFile();
  const item = data.find(c => c.id == req.params.id);
  if (!item) return res.status(404).json({ message: "Fornecedor não encontrado" });
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
  const novo = { id: Date.now().toString(), ...req.body };
  data.push(novo);
  saveFile(data);
  res.status(201).json(novo);
});

router.put("/:id", (req, res) => {
  const data = readFile();
  const index = data.findIndex(c => c.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Fornecedor não encontrado" });

  data[index] = { ...data[index], ...req.body, id: data[index].id };
  saveFile(data);
  res.json(data[index]);
});

router.delete("/:id", (req, res) => {
  const data = readFile();
  const novoArray = data.filter(c => c.id != req.params.id);

  if (data.length === novoArray.length)
    return res.status(404).json({ message: "Fornecedor não encontrado" });

  saveFile(novoArray);
  res.json({ message: "Fornecedor removido com sucesso" });
});

module.exports = router;
