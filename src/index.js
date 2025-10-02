const express = require('express')
const router = express.Router();

const userRoutes = require ("./routes/userRoutes");
router.use("/users", userRoutes);

module.exports = router;

const app = express();
const cors = require("cors");

app.use(cors());

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const routes = require('.')

const hostname = '127.0.0.1';
const PORT = 3000;

const options ={
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Exemplo",
            version: "1.0.0",
            description: `API para projeto 1.
            
            ### TD 01
            Disciplina: DAII 2025.02 Turma 01
            Equipe: Camila, Taily, Karina`,
            license:{
                name: 'Licenciado para DAII',
            },
            contact: {
                name: 'André F Ruaro'
            },
                },
                servers: [
                    {
                        url: "http://localhost:3000/api/",
                        description: 'Development server',
                    },
            ],
    },
    apis: ["./src/routes/*.js"],
};

const specs = swaggerJsDoc(options);

app.use('/api', routes)
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


const arrResponse = [
    { name:"Diego", company: "Hashtag Programação"},
    { name: "Alon", company: "Hashtag Treinamentos"},
];

app.get("/", (req, res) => {
    res.json(arrResponse);
});

app.listen(PORT, () => console.log(`Server running at http://${hostname}:${PORT}/`));
