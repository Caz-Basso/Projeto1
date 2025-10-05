import express from "express";
import fs from "fs";
import swaggerUi from "swagger-ui-express";
import campaignRoutes from "./src/routes/campaign.js";
import supplierRoutes from "./src/routes/suppliers.js";

const app = express();
app.use(express.json());

// 📄 Swagger
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger/swagger.json", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 📦 Rotas
app.use("/campanhas", campaignRoutes);
app.use("/fornecedores", supplierRoutes);

// 🚀 Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
  console.log(`📘 Swagger: http://localhost:${PORT}/api-docs`);
});


