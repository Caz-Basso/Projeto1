const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

let storeDB = loadStore();

function loadStore() {
  try {
    return JSON.parse(fs.readFileSync('./src/db/store.json', 'utf8'));
  } catch (err) {
    return [];
  }
}

function saveStore() {
  try {
    fs.writeFileSync('./src/db/store.json', JSON.stringify(storeDB, null, 2));
    return "Saved";
  } catch (err) {
    return "Not saved";
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       required:
 *         - id
 *         - store_name
 *         - cnpj
 *         - address
 *         - phone_number
 *         - contact_email
 *         - status
 *       properties:
 *         id:
 *           type: string
 *         store_name:
 *           type: string
 *         cnpj:
 *           type: string
 *         address:
 *           type: string
 *         phone_number:
 *           type: string
 *         contact_email:
 *           type: string
 *         status:
 *           type: string
 *       example:
 *         id: "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
 *         store_name: "Bingo Heeler"
 *         cnpj: "12.123.123.1234-12"
 *         address: "Bandit Hemmer, 42"
 *         phone_number: "48 9696 5858"
 *         contact_email: "down@bingo.com"
 *         status: "on"
 */

/**
 * @swagger
 * tags:
 *   name: Lojas
 *   description: API de Cadastro de Lojas
 */

// GET all stores
/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Retorna todas as lojas
 *     tags: [Lojas]
 *     responses:
 *       200:
 *         description: Lista de lojas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 */
router.get('/', (req, res) => {
  storeDB = loadStore();
  res.json(storeDB);
});

// GET store by ID
/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Retorna uma loja pelo ID
 *     tags: [Lojas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da loja
 *     responses:
 *       200:
 *         description: Loja encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       404:
 *         description: Loja não encontrada
 */
router.get('/:id', (req, res) => {
  storeDB = loadStore();
  const store = storeDB.find(s => s.id === req.params.id);
  if (!store) return res.status(404).json({ erro: "Loja não encontrada!" });
  res.json(store);
});

// GET store by name
/**
 * @swagger
 * /stores/search/{name}:
 *   get:
 *     summary: Busca lojas por nome
 *     tags: [Lojas]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome da loja
 *     responses:
 *       200:
 *         description: Lojas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 *       404:
 *         description: Nenhuma loja encontrada
 */
router.get('/search/:name', (req, res) => {
  storeDB = loadStore();
  const stores = storeDB.filter(s => 
    s.store_name.toLowerCase().includes(req.params.name.toLowerCase())
  );
  if (stores.length === 0) return res.status(404).json({ erro: "Nenhuma loja encontrada!" });
  res.json(stores);
});

// POST new store
/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Cria uma nova loja
 *     tags: [Lojas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       201:
 *         description: Loja criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       400:
 *         description: Campos obrigatórios não preenchidos
 */
router.post('/', (req, res) => {
  storeDB = loadStore();
  const { store_name, cnpj, address, phone_number, contact_email, status } = req.body;

  if (!store_name || !cnpj || !address || !phone_number || !contact_email || !status) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios!" });
  }

  const newStore = { id: uuidv4(), ...req.body };
  storeDB.push(newStore);
  saveStore();
  res.status(201).json(newStore);
});

// UPDATE store
/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Atualiza uma loja pelo ID 
 *     tags: [Lojas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da loja
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       200:
 *         description: Loja atualizada com sucesso ou dados para preenchimento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       404:
 *         description: Loja não encontrada
 */
router.put('/:id', (req, res) => {
  storeDB = loadStore();
  const index = storeDB.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ erro: "Loja não encontrada!" });

  if (Object.keys(req.body).length === 0) {
    return res.json(storeDB[index]);
  }

  storeDB[index] = { ...storeDB[index], ...req.body };
  saveStore();
  res.json(storeDB[index]);
});

// DELETE store
/**
 * @swagger
 * /stores/{id}:
 *   delete:
 *     summary: Remove uma loja pelo ID
 *     tags: [Lojas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID da loja
 *     responses:
 *       200:
 *         description: Loja removida com sucesso
 *       404:
 *         description: Loja não encontrada
 */
router.delete('/:id', (req, res) => {
  storeDB = loadStore();
  const index = storeDB.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ erro: "Loja não encontrada!" });

  const deleted = storeDB.splice(index, 1);
  saveStore();
  res.json(deleted[0]);
});

module.exports = router;