const express = require("express");
const router = express.Router();
const connection = require("../data/koneksi");
let asisten = require("../data/asisten");
const { checkSession, checkOpenSession } = require("../middlewares/cekSession");
let date = new Date();
let sessionID = `ORD${date.getFullYear()}${date.getMonth()}${date.getDate()}-${date.getHours()}`;
let menu = [
  {
    nama: "Ayam Geprek",
    slug: "ayamgeprek",
  },
  {
    nama: "Ayam Goreng",
    slug: "ayamgoreng",
  },
  {
    nama: "Es Teh",
    slug: "esteh",
  },
];

router.get("/", (req, res) => {
  connection.query(
    `UPDATE sessions SET status = 'closed' WHERE NOT id = '${sessionID}'`,
  );
  res.render("index");
});

router.get("/order", checkSession, (req, res) => {
  let sessionID = req.sessionID;
  res.redirect(`/order/${sessionID}`);
});

router.get("/order/:id", checkOpenSession, (req, res) => {
  let finalOrder = [];
  let currentSession = req.params.id;
  if(currentSession === sessionID){
    connection.query(
      `UPDATE sessions SET status = 'closed' WHERE NOT id = '${sessionID}'`,
    );
  }
  connection.query(
    `SELECT * FROM orders WHERE sessionID = '${currentSession}'`,
    function (err, result) {
      // var arr1 = [1, 2, 3, 4],
      //   arr2 = [2, 4],
      //   res = arr1.filter((item) => !arr2.includes(item));
      // console.log(res);
      console.log(currentSession);  

      let nimSudahPesan = [];
      let asistenBelumPesan = [];

      if (!result.length) {
        asistenBelumPesan = [...asisten];
      } else {
        result.forEach((item) => {
          nimSudahPesan.push(item.nim);
        });
        asistenBelumPesan = asisten.filter(
          (item) => !nimSudahPesan.includes(item.nim)
        );
      }
      console.log(asistenBelumPesan);

      result.map(function (item) {
        let { id, nim } = item;
        let nama;
        if (result.length) {
          nama = asisten.find((asisten) => asisten.nim === nim).nama;
        }
        let orders = [];
        let singleOrders = {
          id,
          nama,
        };
        item.orders.split(",").map((item) => {
          data = item.split("=");
          orders.push({
            nama: menu.find((i) => i.slug === data[0]).nama,
            qty: data[1],
          });
          singleOrders.orders = orders;
        });
        finalOrder.push(singleOrders);
      });
      console.log(asistenBelumPesan);
      res.render("order", {
        asisten: asistenBelumPesan,
        menu,
        sessionID: currentSession,
        pesanan: finalOrder,
      });
    }
  );
});

router.post("/order", (req, res) => {
  let { nama, menu, sessionID } = req.body;
  let formattedOrders = "";
  formatOrders = () => {
    menu.forEach((item) => {
      formattedOrders += `${item.nama}=${item.qty}`;
      if (item !== menu[menu.length - 1]) {
        formattedOrders += ",";
      }
    });
  };
  formatOrders();

  connection.query(
    `INSERT INTO orders (sessionID,nim,orders) VALUES ('${sessionID}','${nama}','${formattedOrders}')`,
    (err, result) => {
      if (err) throw err;
    }
  );
});

router.get("/order/reopen/:id", (req, res) => {
  let sessionID = req.params.id;
  console.log(sessionID);
  connection.query(
    `UPDATE sessions SET status = 'open' WHERE id = '${sessionID}'`,
    (err, result) => {
      if (err) throw err;
      res.redirect(`/order/${sessionID}?reopen=true`);
    }
  );
});

router.get("/close/:id", (req, res) => {
  let sessionID = req.params.id;
  connection.query(
    `UPDATE sessions SET status = 'closed' WHERE id = '${sessionID}'`,
    (err, result) => {
      if (err) throw err;
      res.redirect('/');
    }
  );
});
module.exports = router;
