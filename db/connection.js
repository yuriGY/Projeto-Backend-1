'use strict';

const { MongoClient } = require('mongodb');
const { MONGO_URI, DB_NAME } = require('../config');

let client = null;
let db = null;

async function conectar() {
  if (db) return db;
  client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  console.log(`Conectado ao banco: ${DB_NAME}`);
  return db;
}

async function fechar() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('Conexão encerrada.');
  }
}

module.exports = { conectar, fechar };
