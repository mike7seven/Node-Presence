var db = require('./db_connection');

db.con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE macs (id char(18) PRIMARY KEY, user VARCHAR(128) Null, description VARCHAR(128) Null, minutes int DEFAULT 0,last_seen_at DATETIME DEFAULT Null)";
  db.con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created!");
    process.exit();
  });

});
