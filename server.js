const express = require('express');
const fs = require('fs');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = 3000;

// Ativa compressão GZIP
app.use(compression());

// Cache de leitura do JSON
let series = [];

function carregarSeries() {
  const filePath = path.join(__dirname, 'series.json');
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    series = JSON.parse(rawData);
    console.log(`✅ ${series.length} séries carregadas.`);
  } catch (err) {
    console.error('❌ Erro ao carregar series.json:', err);
    series = [];
  }
}

// Carrega o JSON uma vez ao iniciar
carregarSeries();

// Rota com paginação
app.get('/series', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginated = series.slice(startIndex, endIndex);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=60'); // cache de 60s
  res.json({
    page,
    limit,
    total: series.length,
    data: paginated
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}/series`);
});
