const express = require('express')
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const routes = require("./routes/Index");

const app = express();
const hostname = '127.0.0.1';
const PORT = 3000;

app.use(cors());
app.use(express.json());

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

app.get("/", (req, res) => {
    res.json({ message: "Api rodando"});
});

app.listen(PORT, () => console.log(`Server rodando em http://${hostname}:${PORT}/`));
