const express = require("express");
const router = new express.Router();
const items = require("../fakeDb");
const ExpressError = require("../expressError");

router.get("/", function (req, res) {
  return res.json({ items });
});

router.post("/", function (req, res, next) {
  try {
    if (!req.body.name) throw new ExpressError("Name is required", 400);

    const newItem = { name: req.body.name, price: req.body.price };
    items.push(newItem);
    res.status(201).json({ added: newItem });
  } catch (e) {
    return next(e);
  }
});

router.get("/:name", function (req, res) {
  const item = items.find((i) => i.name === req.params.name);
  if (item === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  return res.json({ item });
});

router.patch("/:name", function (req, res) {
  const item = items.find((i) => i.name === req.params.name);
  if (item === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  if (req.body.name !== null) {
    item.name = req.body.name;
  }
  if (req.body.price !== null) {
    item.price = req.body.price;
  }
  res.json({ updated: { item } });
});

router.delete("/:name", function (req, res) {
  const item = items.find((i) => i.name === req.params.name);
  if (item === undefined) {
    throw new ExpressError("Item not found", 404);
  }
  items.splice(item, 1);
  res.status(202).json({ message: "Deleted" });
});

module.exports = router;
