const express = require("express");
const router = express.Router();
let menu = [
  {
    nama: "Ayam Geprek",
    slug: "ayamgeprek",
  },
  {
    nama: "Ayam Goreng",
    slug: "ayamgoreng",
  },
];

router.get("/", (req, res) => {
  res.render("index", {
    menu,
  });
});

router.post("/", (req, res) => {
  console.log(req.body);
});

module.exports = router;
