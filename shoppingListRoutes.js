const express = require("express");

const db = require("./fakeDb");
const router = new express.Router();

/* GET /items: return a list of shopping item */
router.get("/", function (req, res, next) {
  return res.json(db.items);
});

/* POST /items: accepts JSON body, add item, and return it */
router.post("/", function (req, res, next) {
  db.items.push({ name: req.body.name, price: req.body.price });
  return res.json({ added: { name: req.body.name, price: req.body.price } });
});

module.exports = router;
