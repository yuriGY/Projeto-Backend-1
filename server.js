'use strict';

const express = require('express');
const session = require('express-session');
const { conectar } = require('./db/connection');
const { SESSION_SECRET, PORT } = require('./config');

const authRoutes = require('./routes/auth');
const categoriasRoutes = require('./routes/categorias');
const vendedoresRoutes = require('./routes/vendedores');
const produtosRoutes = require('./routes/produtos');

const app = express();

app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use('/auth', authRoutes);
app.use('/categorias', categoriasRoutes);
app.use('/vendedores', vendedoresRoutes);
app.use('/produtos', produtosRoutes);

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

async function iniciar() {
  const db = await conectar();
  app.locals.db = db;
  app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
}

iniciar().catch((err) => {
  console.error('Erro fatal ao iniciar:', err.message);
  process.exit(1);
});
