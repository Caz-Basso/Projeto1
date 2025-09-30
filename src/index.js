import express from "express";

const app = express();
const PORT = 3000;
const arrResponse = [
    { name:"Diego", company: "Hashtag Programação"},
    { name: "Alon", company: "Hashtag Treinamentos"},
];

app.get("/", (req, res) => {
    res.json(arrResponse);
});

app.listen(PORT, () => console.log(`O servidor está rodando na porta ${PORT}`));
