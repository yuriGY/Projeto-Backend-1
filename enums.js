'use strict';

const MenuPrincipal = Object.freeze({
  CATEGORIAS:    '1',
  VENDEDORES:    '2',
  PRODUTOS:      '3',
  SAIR:          '0'
});

const MenuOperacoes = Object.freeze({
  INSERIR: '1',
  BUSCAR:  '2',
  DELETAR: '3',
  VOLTAR:  '0'
});

module.exports = { MenuPrincipal, MenuOperacoes };
