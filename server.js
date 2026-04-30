'use strict';

const readline = require('readline');
const { conectar, fechar } = require('./db/connection');
const Categoria = require('./models/Categoria');
const Vendedor = require('./models/Vendedor');
const Produto = require('./models/Produto');
const { MenuPrincipal, MenuOperacoes } = require('./enums');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function perguntar(texto) {
  return new Promise((resolve) => rl.question(texto, (resp) => resolve(resp.trim())));
}

function linha() {
  console.log('─'.repeat(45));
}


async function inserirCategoria(model) {
  const nome = await perguntar('Nome (obrigatório): ');
  const descricao = await perguntar('Descrição: ');
  const res = await model.inserir({ nome, descricao });
  console.log(`Categoria inserida — ID: ${res.insertedId}`);
}

async function buscarCategorias(model) {
  const filtroNome = await perguntar('Filtrar por nome (deixe vazio para listar todas): ');
  const filtro = filtroNome ? { nome: new RegExp(filtroNome, 'i') } : {};
  const lista = await model.buscar(filtro);
  if (!lista.length) { console.log('Nenhuma categoria encontrada.'); return; }
  lista.forEach((c, i) => console.log(`  [${i + 1}] ${c._id} | ${c.nome} | ${c.descricao || '—'}`));
}

async function deletarCategoria(model) {
  const lista = await model.buscar();
  if (!lista.length) { console.log('Nenhuma categoria cadastrada.'); return; }
  lista.forEach((c, i) => console.log(`  [${i + 1}] ${c._id} | ${c.nome}`));
  const escolha = await perguntar('Número da categoria para deletar (0 para cancelar): ');
  const idx = parseInt(escolha) - 1;
  if (isNaN(idx) || idx < 0 || idx >= lista.length) { console.log('Cancelado.'); return; }
  const res = await model.deletar(lista[idx]._id);
  console.log(res.deletedCount ? 'Categoria deletada.' : 'Nenhuma categoria deletada.');
}

async function menuCategorias(model) {
  menuLoop: while (true) {
    linha();
    console.log('  CATEGORIAS');
    console.log(`  ${MenuOperacoes.INSERIR}. Inserir categoria`);
    console.log(`  ${MenuOperacoes.BUSCAR}. Buscar categorias`);
    console.log(`  ${MenuOperacoes.DELETAR}. Deletar categoria`);
    console.log(`  ${MenuOperacoes.VOLTAR}. Voltar`);
    linha();
    const op = await perguntar('Opção: ');
    console.log('');
    try {
      switch (op) {
        case MenuOperacoes.INSERIR: await inserirCategoria(model); break;
        case MenuOperacoes.BUSCAR:  await buscarCategorias(model); break;
        case MenuOperacoes.DELETAR: await deletarCategoria(model); break;
        case MenuOperacoes.VOLTAR:  break menuLoop;
        default: console.log('Opção inválida.');
      }
    } catch (e) {
      console.log(`Erro: ${e.message}`);
    }
    console.log('');
  }
}

async function inserirVendedor(model) {
  const nome = await perguntar('Nome (obrigatório): ');
  const email = await perguntar('E-mail (obrigatório): ');
  const telefone = await perguntar('Telefone: ');
  const endereco = await perguntar('Endereço: ');
  const res = await model.inserir({ nome, email, telefone, endereco });
  console.log(`Vendedor inserido — ID: ${res.insertedId}`);
}

async function buscarVendedores(model) {
  const filtroNome = await perguntar('Filtrar por nome (deixe vazio para listar todos): ');
  const filtro = filtroNome ? { nome: new RegExp(filtroNome, 'i') } : {};
  const lista = await model.buscar(filtro);
  if (!lista.length) { console.log('Nenhum vendedor encontrado.'); return; }
  lista.forEach((v, i) =>
    console.log(`  [${i + 1}] ${v._id} | ${v.nome} | ${v.email} | ${v.telefone || '—'} | ${v.endereco || '—'}`)
  );
}

async function deletarVendedor(model) {
  const lista = await model.buscar();
  if (!lista.length) { console.log('Nenhum vendedor cadastrado.'); return; }
  lista.forEach((v, i) => console.log(`  [${i + 1}] ${v._id} | ${v.nome} | ${v.email}`));
  const escolha = await perguntar('Número do vendedor para deletar (0 para cancelar): ');
  const idx = parseInt(escolha) - 1;
  if (isNaN(idx) || idx < 0 || idx >= lista.length) { console.log('Cancelado.'); return; }
  const res = await model.deletar(lista[idx]._id);
  console.log(res.deletedCount ? 'Vendedor deletado.' : 'Nenhum vendedor deletado.');
}

async function menuVendedores(model) {
  menuLoop: while (true) {
    linha();
    console.log('  VENDEDORES');
    console.log(`  ${MenuOperacoes.INSERIR}. Inserir vendedor`);
    console.log(`  ${MenuOperacoes.BUSCAR}. Buscar vendedores`);
    console.log(`  ${MenuOperacoes.DELETAR}. Deletar vendedor`);
    console.log(`  ${MenuOperacoes.VOLTAR}. Voltar`);
    linha();
    const op = await perguntar('Opção: ');
    console.log('');
    try {
      switch (op) {
        case MenuOperacoes.INSERIR: await inserirVendedor(model); break;
        case MenuOperacoes.BUSCAR:  await buscarVendedores(model); break;
        case MenuOperacoes.DELETAR: await deletarVendedor(model); break;
        case MenuOperacoes.VOLTAR:  break menuLoop;
        default: console.log('Opção inválida.');
      }
    } catch (e) {
      console.log(`Erro: ${e.message}`);
    }
    console.log('');
  }
}

async function inserirProduto(prodModel, catModel, vendModel) {
  const categorias = await catModel.buscar();
  const vendedores = await vendModel.buscar();

  if (!categorias.length) { console.log('Nenhuma categoria cadastrada. Cadastre uma antes.'); return; }
  if (!vendedores.length) { console.log('Nenhum vendedor cadastrado. Cadastre um antes.'); return; }

  const nome = await perguntar('Nome (obrigatório): ');
  const descricao = await perguntar('Descrição: ');
  const precoStr = await perguntar('Preço (obrigatório, ex: 99.90): ');
  const estoqueStr = await perguntar('Estoque (obrigatório, ex: 10): ');

  const preco = parseFloat(precoStr);
  const estoque = parseInt(estoqueStr);
  if (isNaN(preco)) { console.log('Preço inválido.'); return; }
  if (isNaN(estoque)) { console.log('Estoque inválido.'); return; }

  console.log('\nCategorias disponíveis:');
  categorias.forEach((c, i) => console.log(`  [${i + 1}] ${c.nome}`));
  const catEscolha = parseInt(await perguntar('Número da categoria: ')) - 1;
  if (isNaN(catEscolha) || catEscolha < 0 || catEscolha >= categorias.length) { console.log('Seleção inválida.'); return; }

  console.log('\nVendedores disponíveis:');
  vendedores.forEach((v, i) => console.log(`  [${i + 1}] ${v.nome}`));
  const vendEscolha = parseInt(await perguntar('Número do vendedor: ')) - 1;
  if (isNaN(vendEscolha) || vendEscolha < 0 || vendEscolha >= vendedores.length) { console.log('Seleção inválida.'); return; }

  const res = await prodModel.inserir({
    nome, descricao, preco, estoque,
    categoria_id: categorias[catEscolha]._id,
    vendedor_id: vendedores[vendEscolha]._id
  });
  console.log(`Produto inserido — ID: ${res.insertedId}`);
}

async function buscarProdutos(prodModel, catModel) {
  const filtroNome = await perguntar('Filtrar por nome (deixe vazio para listar todos): ');
  const filtro = filtroNome ? { nome: new RegExp(filtroNome, 'i') } : {};
  const lista = await prodModel.buscar(filtro);
  if (!lista.length) { console.log('Nenhum produto encontrado.'); return; }

  const categorias = await catModel.buscar();
  const catMap = {};
  categorias.forEach((c) => { catMap[c._id.toString()] = c.nome; });

  lista.forEach((p, i) => {
    const catNome = catMap[p.categoria_id ? p.categoria_id.toString() : ''] || '—';
    console.log(`  [${i + 1}] ${p._id}`);
    console.log(`       Nome: ${p.nome} | Preço: R$ ${p.preco.toFixed(2)} | Estoque: ${p.estoque}`);
    console.log(`       Categoria: ${catNome} | Desc: ${p.descricao || '—'}`);
  });
}

async function deletarProduto(model) {
  const lista = await model.buscar();
  if (!lista.length) { console.log('Nenhum produto cadastrado.'); return; }
  lista.forEach((p, i) => console.log(`  [${i + 1}] ${p._id} | ${p.nome} | R$ ${p.preco.toFixed(2)}`));
  const escolha = await perguntar('Número do produto para deletar (0 para cancelar): ');
  const idx = parseInt(escolha) - 1;
  if (isNaN(idx) || idx < 0 || idx >= lista.length) { console.log('Cancelado.'); return; }
  const res = await model.deletar(lista[idx]._id);
  console.log(res.deletedCount ? 'Produto deletado.' : 'Nenhum produto deletado.');
}

async function menuProdutos(prodModel, catModel, vendModel) {
  menuLoop: while (true) {
    linha();
    console.log('  PRODUTOS');
    console.log(`  ${MenuOperacoes.INSERIR}. Inserir produto`);
    console.log(`  ${MenuOperacoes.BUSCAR}. Buscar produtos`);
    console.log(`  ${MenuOperacoes.DELETAR}. Deletar produto`);
    console.log(`  ${MenuOperacoes.VOLTAR}. Voltar`);
    linha();
    const op = await perguntar('Opção: ');
    console.log('');
    try {
      switch (op) {
        case MenuOperacoes.INSERIR: await inserirProduto(prodModel, catModel, vendModel); break;
        case MenuOperacoes.BUSCAR:  await buscarProdutos(prodModel, catModel); break;
        case MenuOperacoes.DELETAR: await deletarProduto(prodModel); break;
        case MenuOperacoes.VOLTAR:  break menuLoop;
        default: console.log('Opção inválida.');
      }
    } catch (e) {
      console.log(`Erro: ${e.message}`);
    }
    console.log('');
  }
}

async function main() {
  const db = await conectar();
  const catModel = new Categoria(db);
  const vendModel = new Vendedor(db);
  const prodModel = new Produto(db);

  menuLoop: while (true) {
    linha();
    console.log('  MENU PRINCIPAL');
    console.log(`  ${MenuPrincipal.CATEGORIAS}. Categorias`);
    console.log(`  ${MenuPrincipal.VENDEDORES}. Vendedores`);
    console.log(`  ${MenuPrincipal.PRODUTOS}. Produtos`);
    console.log(`  ${MenuPrincipal.SAIR}. Sair`);
    linha();
    const op = await perguntar('Opção: ');
    console.log('');
    try {
      switch (op) {
        case MenuPrincipal.CATEGORIAS:    await menuCategorias(catModel); break;
        case MenuPrincipal.VENDEDORES:    await menuVendedores(vendModel); break;
        case MenuPrincipal.PRODUTOS:      await menuProdutos(prodModel, catModel, vendModel); break;
        case MenuPrincipal.SAIR:          break menuLoop;
        default: console.log('Opção inválida.');
      }
    } catch (e) {
      console.log(`Erro: ${e.message}`);
    }
    console.log('');
  }

  rl.close();
  await fechar();
}

main().catch((erro) => {
  console.error('Erro fatal:', erro.message);
  rl.close();
  process.exit(1);
});
