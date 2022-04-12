const connection = require("../data/koneksi");

const checkSession = (req, res, next) => {
  let date = new Date();
  let sessionID = `ORD${date.getFullYear()}${date.getMonth()+1}${date.getDate()+1}-${date.getHours()}`;

  connection.query(
    `SELECT * FROM sessions WHERE id = '${sessionID}'`,
    (err, result) => {
      if (err) throw err;
      if (result.length > 0) {
        req.sessionID = sessionID;
        next();
      } else {
        connection.query(
          `INSERT INTO sessions (id, status) VALUES ('${sessionID}', 'open')`,
          (err, result) => {
            if (err) throw err;
            req.sessionID = sessionID;
            connection.query(
              `UPDATE sessions SET status = 'closed' WHERE NOT id = '${sessionID}'`
            );
            next();
          }
        );
      }
    }
  );
};

const checkOpenSession = (req, res, next) => {
  let date = new Date();
  let newSessionID = `ORD${date.getFullYear()}${date.getMonth()+1}${date.getDate()+1}-${date.getHours()}`;
  let sessionID = req.params.id;
  console.log(sessionID);
  if (req.query.reopen) {
    next();
  } else if (sessionID === newSessionID) {
    next();
  } else {
    connection.query(
      `SELECT * FROM sessions WHERE id = '${sessionID}'`,
      (err, result) => {
        if (err) throw err;
        console.log(result.length);
        if (!result.length) {
          if (result[0].status === "open") {
            connection.query(
              `UPDATE sessions SET status = 'closed' WHERE id = '${sessionID}'`
            );
          }
        }
      }
    );
    res.render("closed-session", {
      sessionID,
    });
  }
};

module.exports = { checkSession, checkOpenSession };
