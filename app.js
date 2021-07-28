const express = require("express");
const shoppingListRoutes = require("./shoppingListRoutes");

const app = express();

app.use(express.json());
app.use("/items", shoppingListRoutes);
module.exports = app;
