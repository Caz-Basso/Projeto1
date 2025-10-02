const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');


var productDB = loadProduct();


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
      return "Saved"
    } catch (err) {
      return "Not saved";
    }
  }


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - descripition
 *         - price
 *         - stock_quantity
 *         - supplier_id
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automáticamente pelo cadastro do produto
 *         name:
 *           type: string
 *           description: Nome do produto
 *         descripition:
 *           type: string
 *           description: Descrição do produto
 *         price:
 *           type: string
 *           description: Preço do produto
 *         stock_quantity:
 *           type: string
 *           description: Quantidade de produtos em estoque
 *         supplier_id:
 *           type: string
 *           description: Id do fornecedor
 *         status:
 *           type: string
 *           description: Identifica se o produto ainda é ativo no sistema ou não
  *       example:
 *         id: afr0b6d0-a69b-4938-b116-f2e8e0d08542
 *         name: Martelo
 *         description: Martelo com cabo de madeira
 *         price: 20
 *         stock_quantity:15
 *         supplier_id: 7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd
 *         status: on
 */


 /**
  * @swagger
  * tags:
  *   name: Usuarios
  *   description:
  *     API de Cadastro de Produto
  *     **Por Camila Basso**
  */


 /**
 * @swagger
 * /students:
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


// GET "/products"
router.get('/', (req, res) =>{
    console.log("getroute");
    productDB = loadUser();
    res.json(productDB);
})


/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Retorna um produto pelo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Um produto pelo ID
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */


// GET "/products/1"
router.get('/:id', (req, res) => {
    const id = req.params.id
    productDB = loadProduct();
    var product = productDB.find((product) => product.id === id )
    if(!user) return res.status(404).json({
        "erro": "Produto não encontrado!"
    })
    res.json(product)
})


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: O produto foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */


// POST "/product" BODY { "nome": "Machado"}
router.post('/', (req, res) => {
    const newProduct = {
        id: uuidv4(),
        ...req.body
    }
    console.log(newProduct);
    productDB = loadProduct();
    productDB.push(newProduct)
    let result = saveProduct();
    console.log(result);
    return res.json(newProduct)
})


/**
 * @swagger
 * /products/{id}:
 *  put:
 *    summary: Atualiza um produto pelo ID
 *    tags: [Products]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do produto
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Product'
 *    responses:
 *      200:
 *        description: O produto foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *      404:
 *        description: Produto não encontrado
 */


// PUT "/product/1" BODY { "nome": "Tijolo"}
router.put('/:id', (req, res) => {
    const id = req.params.id
    const newProduct = req.body
    productDB = loadProduct();
    const currentProduct = productDB.find((product) => product.id === id )
    const currentIndex = productDB.findIndex((product) => product.id === id )
    if(!currentProduct)
        return res.status(404).json({
        "erro": "Produto não encontrado!"
    })
    productDB[currentIndex] = newProduct
    let result = saveProduct();
    console.log(result);
    return res.json(newProduct)
})


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um produto pelo ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: O produto foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produto não encontrado
 */


// DELETE "/products/1"
router.delete('/:id', (req, res) => {
    const id = req.params.id
    productDB = loadProduct();
    const currentProduct = productDB.find((product) => product.id === id )
    const currentIndex = productDB.findIndex((product) => product.id === id )
    if(!currentProduct) return res.status(404).json({
        "erro": "Produto não encontrado!"
    })
    var deletado = productDB.splice(currentIndex, 1)
    let result = saveProduct();
    console.log(result);
    res.json(deletado)
})

module.exports = router