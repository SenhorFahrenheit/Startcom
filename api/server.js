// Importando o Express
const express = require("express");
const config = require("dotenv").config();

// Criando a aplicação
const app = express();

// Middleware para permitir JSON no corpo das requisições
app.use(express.json());

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Rota GET de exemplo
app.get("/", (req, res) => {
  res.send("🚀 Servidor rodando com sucesso!");
});
// Rota POST de exemplo
app.post("/dados", (req, res) => {
  const body = req.body; // pega o que o cliente enviou no JSON
  res.json({ message: "Dados recebidos!", body });
});

// Subindo o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

