var db = require('./db_connection');
const format = require("node.date-time");	
limit = 5;

module.exports = {
	
	whoAmI: function (user_id, callback) {
		var sql = "SELECT * FROM macs WHERE user = '" + user_id +"'"; 
		db.con.query(sql, function(err, rows) {
			callback(rows)
		});
	},
  
	whoIsHere: function(callback){
		myEndDateTime = new Date();
		
		guests_count = 0;
		member_count = 0;
		
		var myStartDate = new Date(myEndDateTime - 3 * 60000).format("Y-M-d H:m:S");
		
		var guest_sql = "SELECT id FROM macs WHERE user = 'unknown' AND last_seen_at >  '" + myStartDate +"'" ; 
		
		var member_sql = "SELECT id FROM macs WHERE user != 'unknown' AND user != 'blacklist' AND last_seen_at >  '" +myStartDate +"'" ; 
		
		db.con.query(guest_sql, function(err, rows) {
			guests_count = rows.length;
		});
		
		db.con.query(member_sql, function(err, rows) {
			member_count = rows.length;	
			callback([guests_count, member_count])
		});
		
	  },
  
	topUsers: function(limit, callback){
		if(limit>10){
		  limit = 10;
		}
		 var sql = "SELECT user, minutes FROM macs WHERE user != 'unknown' AND user != 'blacklist' AND minutes > 0 GROUP BY user, minutes ORDER BY minutes DESC LIMIT 0,"+limit+"";
			db.con.query(sql, function(err, rows) {
				callback(rows);
			});
	},
	
	blackList: function(id, callback){
		//console.log(id)
		var sql = "SELECT id FROM macs WHERE id = '" + id+"'"; 
		db.con.query(sql, function(err, rows) {
			if(rows.length == 1){
				var sql = "UPDATE macs SET user = 'blacklist' WHERE id = '" +id +"'";
				db.con.query(sql, function(err, rows) {
					console.log('updated')
					callback(1);
				});
			}
			else{
				var sql = "INSERT INTO macs (id, user, minutes) VALUES ('"+id+"', 'blacklist',0)";
				db.con.query(sql, function(err, rows) {
					console.log('inserted')
					callback(1);
				});
			}
		});
	}
  }
  