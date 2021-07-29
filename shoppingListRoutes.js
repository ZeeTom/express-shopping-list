const express = require("express");
const { NotFoundError, BadRequestError } = require("./expressError")
const db = require("./fakeDb");
const router = new express.Router();

/* GET /items: return a list of shopping item */
router.get("/", function (req, res, next) {
  return res.json(db.items);
});

/* POST /items: accepts JSON body, add item, and return it */
router.post("/", function (req, res, next) {
  if (!req.body.name || !req.body.price) {
    throw new BadRequestError("Invalid input");
  } else if (db.items.find(item => req.body.name === item.name)) {
    // to prevent adding duplicate items to list
    throw new BadRequestError("Item already exists.")
  }
  db.items.push({ name: req.body.name, price: req.body.price });
  return res.json({ added: { name: req.body.name, price: req.body.price } });
});

/* GET /items/:name: return single item */
router.get("/:name", function (req, res, next) {
  let item = db.items.find(item => req.params.name === item.name);
  if (!item) {
    throw new NotFoundError(`${req.params.name} not found`);
  } 
  return res.json(item);
})

/* PATCH /items/:name:  accept JSON body, modify item, return it */
router.patch("/:name", function (req, res, next) {
  let itemIdx = db.items.findIndex(item => req.params.name === item.name);
  if (itemIdx === -1) {
    throw new NotFoundError(`${req.params.name} not found`);
  }
  db.items[itemIdx] = { name: req.body.name, price: req.body.price }
  return res.json({updated: { name: req.body.name, price: req.body.price }});
})

/* DELETE /items/:name: delete item */
router.delete("/:name", function (req, res, next) {
  let itemIdx = db.items.findIndex(item => req.params.name === item.name);
  if (itemIdx === -1) {
    throw new NotFoundError(`${req.params.name} not found`);
  }
  db.items.splice(itemIdx, 1);
  return res.json({message: "Deleted"})
})

module.exports = router;
