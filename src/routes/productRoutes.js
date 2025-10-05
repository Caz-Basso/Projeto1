const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

let productDB = loadProduct();

// Função carrega produtos a partir do arquivo JSON
function loadProduct() {
  try {
    return JSON.parse(fs.readFileSync('./src/db/product.json', 'utf8'));
  } catch (err) {
    return [];
  }
}

// Função para salvar os produtos no arquivo JSON
function saveProduct() {
  try {
    fs.writeFileSync('./src/db/product.json', JSON.stringify(productDB, null, 2));
    return "Saved";
  } catch (err) {
    return "Not saved";
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - price
 *         - stock_quantity
 *         - supplier_id
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do produto
 *         name:
 *           type: string
 *           description: Nome do produto
 *         description:
 *           type: string
 *           description: Descrição do produto
 *         price:
 *           type: string
 *           description: Preço do produto
 *         stock_quantity:
 *           type: string
 *           description: Quantidade de produtos no estoque
 *         supplier_id:
 *           type: string
 *           description: Identificação dos fornecedores
 *         status:
 *           type: string
 *           description: Identifica se o produto está ativo no sistema
 *       example:
 *         id: afr0b6d0-a69b-4938-b116-f2e8e0d08542
 *         name: Martelo
 *         description: Martelo com cabo de madeira
 *         price: 20
 *         stock_quantity: 72
 *         supplier_id: 7a6cc1282c5f6ec0235acd2bfa780145aaskem5n
 *         status: on
 */

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: API de Cadastro de Produtos (Por Camila Basso)
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retorna uma lista de todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: A lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

router.get('/', (req, res) => {
  productDB = loadProduct();
  res.json(productDB);
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retorna um produtos pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */

router.get('/:id', (req, res) => {
  const product = productDB.find(u => u.id === req.params.id);
  if (!product) return res.status(404).json({ erro: "Produto não encontrado!" });
  res.json(product);
});

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

router.post('/', (req, res) => {
  const { name, description, price, stock_quantity, supplier_id, status} = req.body;

  if ( !name || !description || !price || !stock_quantity || !supplier_id || !status){
    return res.status(400).json ({ erro: "Preencha todos os campos obrigatórios!"});
  }
  
  productDB = loadProduct;
  const newProduct = { id: uuidv4(), ...req.body };
  productDB.push(newProduct);
  saveProduct();
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */

router.put('/:id', (req, res) => {
  productDB = loadProduct;
  const index = productDB.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ erro: "Produto não encontrado!" });

  productDB[index] = { ...productDB[index], ...req.body }; // preserva id
  saveProduct();
  res.json(productDB[index]);
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove um produto pelo ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produtos removido com sucesso
 *       404:
 *         description: Produtos não encontrado
 */

router.delete('/:id', (req, res) => {
  productDB = loadProduct;
  const index = productDB.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ erro: "Produto não encontrado!" });

  const deleted = productDB.splice(index, 1);
  saveProduct();
  res.json(deleted[0]);
});

/**
 * @swagger
 * /products/nome/{name}:
 *   get:
 *     summary: Retorna um produtos pelo nome
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do produto
 *     responses:
 *       200:
 *         description: Lista de produtos encontrados
 *         content:
 *           application/json:
 *             schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */

router.get('/nome/:name', (req, res) => {
  const termo = req.params.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove acentos

  const produtosEncontrados = productDB.filter(p =>
    p.name &&
    p.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes(termo)
  );

  if (produtosEncontrados.length === 0)
    return res.status(404).json({ erro: "Produto não encontrado!" });

  res.json(produtosEncontrados);
});


module.exports = router;
