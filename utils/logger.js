'use strict';

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', 'logs');
const LOG_FILE = path.join(LOG_DIR, 'errors.log');

function registrar(classe, metodo, erro) {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
  const entrada = `[${new Date().toISOString()}] [${classe}] [${metodo}] ${erro.message}\n`;
  fs.appendFileSync(LOG_FILE, entrada, 'utf8');
  console.error(`LOG: ${entrada.trim()}`);
}

module.exports = { registrar };
