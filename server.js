const express = require('express');
const fs = require('fs');
const path = require('path');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 10000;

// Compressão GZIP
app.use(compression());

// Carrega o JSON uma vez
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

carregarSeries();

// Rota com paginação
app.get('/series', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginated = series.slice(startIndex, endIndex);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.json({
    page,
    limit,
    total: series.length,
    data: paginated
  });
});

// Endpoint de status (opcional para Render)
app.get('/', (req, res) => {
  res.send('✅ API de Séries está online!');
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
