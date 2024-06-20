const express = require("express");

const Roles = {
    STOCK_CONTROL: 'stockControl',
    ADMIN: 'admin',
    EMPLOYEE: 'employee'
  };

const productUnit = {
    LITRE: 'litre',
    GRAM: 'gram',
    PIECES: 'pieces'
  };
  const ingredientUnit = {
    KG: 'kg',
    G: 'g',
    L: 'l',
    ML: 'ml',
    PCS: 'pcs'
  };
  const stockMovementType = {
    RECEIPT: 'receipt', 
    ISSUE:'issue'
  };

module.exports = {Roles, productUnit, ingredientUnit, stockMovementType}