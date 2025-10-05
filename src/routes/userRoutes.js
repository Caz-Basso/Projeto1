const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

let userDB = loadUser();

// Função carrega usuários a partir do arquivo JSON
function loadUser() {
  try {
    return JSON.parse(fs.readFileSync('./src/db/user.json', 'utf8'));
  } catch (err) {
    return [];
  }
}

// Função para salvar os usuários no arquivo JSON
function saveUser() {
  try {
    fs.writeFileSync('./src/db/user.json', JSON.stringify(userDB, null, 2));
    return "Saved";
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
 *         - contact_email
 *         - user
 *         - pwd
 *         - level
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente pelo cadastro do usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         contact_email:
 *           type: string
 *           description: Email do usuário
 *         user:
 *           type: string
 *           description: Nome de identificação do usuário
 *         pwd:
 *           type: string
 *           description: Senha do usuário
 *         level:
 *           type: string
 *           description: Nível de autoridade do usuário
 *         status:
 *           type: string
 *           description: Identifica se o usuário está ativo no sistema
 *       example:
 *         id: afr0b6d0-a69b-4938-b116-f2e8e0d08542
 *         name: Camila Basso
 *         contact_email: camila.basso@unesc.net
 *         user: camila.basso
 *         pwd: 7a6cc1282c5f6ec0235acd2bfa780145aaskem5n
 *         level: admin
 *         status: on
 */

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: API de Cadastro de Usuário (Por Camila Basso)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna uma lista de todos os usuários
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: A lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

router.get('/', (req, res) => {
  userDB = loadUser();
  res.json(userDB);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */

router.get('/:id', (req, res) => {
  const user = userDB.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ erro: "Usuário não encontrado!" });
  res.json(user);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */

router.post('/', (req, res) => {
  const { name, contact_email, user, pwd, level, status } = req.body;

  if (!name || !contact_email || !user || !pwd || !level || !status){
    return res.status(400).json ({ erro: "Preencha todos os campos obrigatórios!"});
  }

  const newUser = { id: uuidv4(), ...req.body };
  userDB.push(newUser);
  saveUser();
  res.status(201).json(newUser);
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuário não encontrado
 */

router.put('/:id', (req, res) => {
  userDB = loadUser();
  saveUser();
  const index = userDB.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ erro: "Usuário não encontrado!" });

  userDB[index] = { ...userDB[index], ...req.body }; // preserva id
  res.json(userDB[index]);
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */

router.delete('/:id', (req, res) => {
  userDB = loadUser();
  const index = userDB.findIndex(u => u.id === req.params.id);
  if (index === -1) return res.status(404).json({ erro: "Usuário não encontrado!" });

  const deleted = userDB.splice(index, 1);
  saveUser();
  res.json(deleted[0]);
});

module.exports = router;
