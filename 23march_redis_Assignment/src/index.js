const express = require("express");


const app = express();
app.use(express.json());


const productController = require("./controllers/product.controllers");
app.use("/products",productController)


module.exports = app;