import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import campaignRoutes from "./routes/campaignRoutes.js";
import suppliersRoutes from "./routes/suppliersRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

const swaggerDocument = JSON.parse(fs.readFileSync("./swagger/swagger.json", "utf8"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/campanhas", campaignRoutes);
app.use("/fornecedores", suppliersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
console.log(`📘 Documentação disponível em http://localhost:${PORT}/api-docs`);
