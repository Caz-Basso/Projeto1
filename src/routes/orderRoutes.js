const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

let orderDB = loadOrder();

function loadOrder() {
  try {
    return JSON.parse(fs.readFileSync('./src/db/order.json', 'utf8'));
  } catch (err) {
    return [];
  }
}

function saveOrder() {
  try {
    fs.writeFileSync('./src/db/order.json', JSON.stringify(orderDB, null, 2));
    return "Saved";
  } catch (err) {
    return "Not saved";
  }
}

function formatDate(dateString) {
  if (!dateString) return new Date().toLocaleDateString('pt-BR');
  
  if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
    return dateString;
  }

  if (dateString.match(/^\d{4}-\d{2}-\d{2}/)) {
    const [year, month, day] = dateString.split(' ')[0].split('-');
    return `${day}/${month}/${year}`;
  }
  
  return new Date().toLocaleDateString('pt-BR');
}

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - product_id
 *         - quantity
 *         - campaign_id
 *         - unit_price
 *       properties:
 *         product_id:
 *           type: string
 *         quantity:
 *           type: integer
 *         campaign_id:
 *           type: string
 *         unit_price:
 *           type: number
 *       example:
 *         product_id: "101"
 *         quantity: 2
 *         campaign_id: "301"
 *         unit_price: 20.00
 *
 *     Order:
 *       type: object
 *       required:
 *         - store_id
 *         - items
 *         - total_amount
 *         - status
 *         - date
 *       properties:
 *         id:
 *           type: string
 *           readOnly: true
 *         store_id:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         total_amount:
 *           type: number
 *         status:
 *           type: string
 *           enum: [Pending, Shipped, Delivered]
 *         date:
 *           type: string
 *           description: Data no formato dd/mm/yyyy
 *       example:
 *         id: "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
 *         store_id: "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd"
 *         items:
 *           - product_id: "101"
 *             quantity: 2
 *             campaign_id: "301"
 *             unit_price: 20.00
 *         total_amount: 123.00
 *         status: "Pending"
 *         date: "15/08/2023"
 */

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: API de Pedidos
 */

// GET all orders
/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retorna todos os pedidos
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */
router.get('/', (req, res) => {
  orderDB = loadOrder();
  res.json(orderDB);
});

// GET order by ID
/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Retorna um pedido pelo ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', (req, res) => {
  orderDB = loadOrder();
  const order = orderDB.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ erro: "Pedido não encontrado!" });
  res.json(order);
});

// GET orders by date
/**
 * @swagger
 * /orders/date/{date}:
 *   get:
 *     summary: Busca pedidos por data
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *         required: true
 *         description: Data no formato dd/mm/yyyy
 *     responses:
 *       200:
 *         description: Pedidos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Nenhum pedido encontrado
 */
router.get('/date/:date', (req, res) => {
  orderDB = loadOrder();
  
  const orders = orderDB.filter(o => o.date === req.params.date);
  if (orders.length === 0) return res.status(404).json({ erro: "Nenhum pedido encontrado para esta data!" });
  res.json(orders);
});

// POST new order
/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Campos obrigatórios não preenchidos
 */
router.post('/', (req, res) => {
  orderDB = loadOrder();
  const { store_id, items, total_amount, status, date } = req.body;

  if (!store_id || !items || !total_amount || !status || !date) {
    return res.status(400).json({ erro: "Preencha todos os campos obrigatórios!" });
  }

  const newOrder = { 
    id: uuidv4(), 
    ...req.body,
    date: formatDate(date) 
  };
  orderDB.push(newOrder);
  saveOrder();
  res.status(201).json(newOrder);
});

// UPDATE order
/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Atualiza um pedido pelo ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:id', (req, res) => {
  orderDB = loadOrder();
  const index = orderDB.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ erro: "Pedido não encontrado!" });

  const updatedData = req.body.date 
    ? { ...req.body, date: formatDate(req.body.date) }
    : req.body;

  orderDB[index] = { ...orderDB[index], ...updatedData };
  saveOrder();
  res.json(orderDB[index]);
});

// DELETE order
/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Remove um pedido pelo ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:id', (req, res) => {
  orderDB = loadOrder();
  const index = orderDB.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ erro: "Pedido não encontrado!" });

  const deleted = orderDB.splice(index, 1);
  saveOrder();
  res.json(deleted[0]);
});

module.exports = router;