	var scan = require('./scan');
	var db = require('./db_connection');
	const format = require("node.date-time");
	
	scan.scan(function(records){

        var date = new Date().format("Y-M-d H:m:S");

        records.forEach(function(element, value) {

            var sql_sel = "SELECT id FROM macs WHERE id = '" + element.mac+"'";
            db.con.query(sql_sel, function(err, rows) {

                if(rows.length == 0){
                    var sql_ins = "INSERT INTO macs (id, user, description, minutes) VALUES ('"+element.mac+"','unknown','"+element.description+"',1)";
                    db.con.query(sql_ins, function (err, result) {
                        if (err) throw err;
                        if(records.length == value+1){
                            process.exit();
                        }
                    });
                }
                else {

                    var sql_upd = "UPDATE macs SET minutes = minutes+1, last_seen_at = '"+date+"' WHERE id = '"+element.mac+"'";

                    db.con.query(sql_upd, function (err, result) {
                        if (err) throw err;

                        if(records.length == value+1){
                            process.exit();
						}
                    });

                }

            });
        });

	});
