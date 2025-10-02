const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs');


var userDB = loadUser();


// Função carrega usuarios a partir do arquivo JSON
function loadUser() {
    try {
      return JSON.parse(fs.readFileSync('./src/db/user.json', 'utf8'));
    } catch (err) {
      return [];
    }
  }
// Função para salvar os usuarios no arquivo JSON
function saveUser() {
    try {
      fs.writeFileSync('./src/db/user.json', JSON.stringify(userDB, null, 2));
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
 *         - contact_email
 *         - user
 *         - pwd
 *         - level
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automáticamente pelo cadastro do usuario
 *         name:
 *           type: string
 *           description: Nome do usuario
 *         contact_email:
 *           type: string
 *           description: Email do usuario
 *         user:
 *           type: string
 *           description: Nome de identificação do usuario
 *         pwd:
 *           type: string
 *           description: Senha gerada automáticamente no cadastro do usuario
 *         level:
 *           type: string
 *           description: Nivel de autoridade do usuario
 *         status:
 *           type: string
 *           description: Identifica se o usuario ainda é ativo no sistema ou não
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
  *   description:
  *     API de Cadastro de Usuario
  *     **Por Camila Basso**
  */


 /**
 * @swagger
 * /students:
 *   get:
 *     summary: Retorna uma lista de todos os usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: A lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */


// GET "/students"
router.get('/', (req, res) =>{
    console.log("getroute");
    userDB = loadUser();
    res.json(userDB);
})


/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Retorna um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: Um estudante pelo ID
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */


// GET "/students/1"
router.get('/:id', (req, res) => {
    const id = req.params.id
    userDB = loadUser();
    var user = userDB.find((user) => user.id === id )
    if(!user) return res.status(404).json({
        "erro": "Usuario não encontrado!"
    })
    res.json(user)
})


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuario
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: O Usuario foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */


// POST "/user" BODY { "nome": "Claudio"}
router.post('/', (req, res) => {
    const newUser = {
        id: uuidv4(),
        ...req.body
    }
    console.log(newUser);
    userDB = loadUser();
    userDB.push(newUser)
    let result = saveUser();
    console.log(result);
    return res.json(newUser)
})


/**
 * @swagger
 * /users/{id}:
 *  put:
 *    summary: Atualiza um usuario pelo ID
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: ID do usuario
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: O usuario foi atualizado com sucesso
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: User não encontrado
 */


// PUT "/users/1" BODY { "nome": "Claudia"}
router.put('/:id', (req, res) => {
    const id = req.params.id
    const newUser = req.body
    userDB = loadUser();
    const currentUser = userDB.find((user) => user.id === id )
    const currentIndex = userDB.findIndex((user) => user.id === id )
    if(!currentUser)
        return res.status(404).json({
        "erro": "Usuario não encontrado!"
    })
    userDB[currentIndex] = newUser
    let result = saveUser();
    console.log(result);
    return res.json(newUser)
})


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove um usuario pelo ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do usuario
 *     responses:
 *       200:
 *         description: O usuario foi removido com sucesso
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario não encontrado
 */


// DELETE "/users/1"
router.delete('/:id', (req, res) => {
    const id = req.params.id
    userDB = loadUser();
    const currentUser = userDB.find((user) => user.id === id )
    const currentIndex = userDB.findIndex((user) => user.id === id )
    if(!currentUser) return res.status(404).json({
        "erro": "Usuario não encontrado!"
    })
    var deletado = userDB.splice(currentIndex, 1)
    let result = saveUser();
    console.log(result);
    res.json(deletado)
})


module.exports = router