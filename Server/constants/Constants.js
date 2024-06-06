const express = require("express");

export const userRoles = {
    STOCK_CONTROL: 'stockControl',
    ADMIN: 'admin'
  };

  export const productUnit = {
    LITRE: 'litre',
    GRAM: 'gram',
    PIECES: 'pieces'
  };
  export const ingredientUnit = {
    KG: 'kg',
    G: 'g',
    L: 'l',
    ML: 'ml',
    PCS: 'pcs'
  };
  export const stockMovementType = {
    IN: 'IN',
    OUT: 'OUT'
  };