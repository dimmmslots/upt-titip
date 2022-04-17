const express = require("express");
const router = express.Router();
const connection = require("../data/koneksi");
const asyncDB = require("mysql2-promise")();
let asisten = require("../data/asisten");
const { checkSession, checkOpenSession } = require("../middlewares/cekSession");
const checkValidHours = require("../middlewares/cekValidHours");
const { fetchOneOrder } = require("../utils/crud");
let date = new Date();
let sessionID = `ORD${date.getFullYear()}${date.getMonth() + 1}${
  date.getDate()
}-${date.getHours()}`;
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

asyncDB.configure({
  host: "localhost",
  user: "root",
  database: "upt_titip",
});

router.get("/", (req, res) => {
  console.log(sessionID)
  connection.query(
    `UPDATE sessions SET status = 'closed' WHERE NOT id = '${sessionID}'`
  );
  res.render("index");
});

router.get("/order", checkSession, (req, res) => {
  let sessionID = req.sessionID;
  res.redirect(`/order/${sessionID}`);
});

router.get("/order/:id", checkValidHours, checkOpenSession, (req, res) => {
  let finalOrder = [];
  let currentSession = req.params.id;
  if (currentSession === sessionID) {
    connection.query(
      `UPDATE sessions SET status = 'closed' WHERE NOT id = '${sessionID}'`
    );
    connection.query(
      `UPDATE sessions SET status = 'open' WHERE id = '${sessionID}'`
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
        result.map(function (item) {
          let { id, nim } = item;
          console.log(item);
          let nama = asisten.find((asisten) => asisten.nim === nim).nama;
          let orders = [];
          let singleOrders = {
            id,
            nama,
          };
          item.orders.split(",").map((item) => {
            console.log(item)
            data = item.split("=");
            orders.push({
              nama: menu.find((i) => i.slug === data[0]).nama,
              qty: data[1],
            });
            singleOrders.orders = orders;
          });
          finalOrder.push(singleOrders);
        });
      }
      res.render("order", {
        asisten: asistenBelumPesan,
        menu,
        sessionID: currentSession,
        pesanan: finalOrder,
      });
      console.log(asistenBelumPesan);
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

router.get("/order/reopen/:id", checkValidHours, (req, res) => {
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
      res.redirect("/");
    }
  );
});

router.delete("/order/:id", async (req, res) => {
  try {
    asyncDB.query(`DELETE FROM orders WHERE id = '${req.params.id}'`);
  } catch (error) {
    console.log(error);
  }
});

router.get("/order/edit/:id", (req, res) => {
  let id = req.params.id;
  fetchOneOrder(id).then((result) => {
    let { sessionID, nim, orders } = result[0];
    let nama = asisten.find((asisten) => asisten.nim === nim).nama;
    let ordersArray = orders.split(",");
    let ordersObj = [];
    ordersArray.map((item) => {
      let data = item.split("=");
      ordersObj.push({
        nama: menu.find((i) => i.slug === data[0]).nama,
        qty: data[1],
        slug: data[0],
      });
    });
    res.render("editOrder", {
      id,
      nama,
      orders: ordersObj,
      menu,
      sessionID,
    });
  });
});

router.put("/order/:id", (req, res) => {
  let { sessionID, orders } = req.body;
  let id = req.params.id;
  asyncDB.query(
    `UPDATE orders SET orders = '${orders}' WHERE id = '${id}'`
  );
  res.status(200).send({
    message: "success",
  });
});
module.exports = router;
