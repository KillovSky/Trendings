"use strict";
const trendings = require("./index");

/* Inicia o scrapping na região do Brasil */
trendings.info("brazil").then(console.log);