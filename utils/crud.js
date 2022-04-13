const asyncDB = require("mysql2-promise")();

asyncDB.configure({
  host: "localhost",
  user: "root",
  database: "upt_titip",
});

async function fetchOrders(sessionID) {
  try {
    let [rows, fields] = await asyncDB.query(
      `SELECT * FROM orders WHERE sessionID = '${sessionID}'`
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

async function fetchOneOrder(id) {
  try {
    let [rows, fields] = await asyncDB.query(
      `SELECT * FROM orders WHERE id = '${id}'`
    );
    return rows;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { fetchOrders, fetchOneOrder };
