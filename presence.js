#!/usr/bin/env node
'use strict';

var program = require('commander');
var SlackBot = require('slackbots');
var db = require('./db_connection');
var func = require('./functions');
var config = require('./config');

program
  .command('bot')
  .action(() => {
	var bot = new SlackBot({
		token: config.SLACK_TOKEN,
		name: config.SLACK_BOT_NAME
	});

	bot.on('message', function(data) {
		
		if(data.type == 'message'){
			//console.log(data)
				
			if(data.text.startsWith('@presence') ) {
				var user_id = data.user
				var current_channel = data.channel
						
				var arr = data.text.replace('@presence','');
				
				if(arr.indexOf('register') > -1){
					var id = arr.replace('register','');
					id = id.replace(/\s/g, '');		
					var sql = "SELECT id FROM macs WHERE id = '" + id +"'";
					
					db.con.query(sql, function(err, rows) {
						if(rows.length == 1){
							var sql = "UPDATE macs SET user = '"+user_id+"' WHERE id = '" +id +"'";
							db.con.query(sql, function (err, result) {
								if (err) throw err;
							});
						}
						else{
							var sql = "INSERT INTO macs (id, user, minutes) VALUES ('"+id+"', '"+user_id+"','unknown',0)";
						}
						
						bot.postMessage(current_channel, "associated "+id+" with").always(function(data) {
							console.log(data);
						});
						
					})
		
				}
				if(arr.indexOf('remove') > -1){
					var id = arr.replace('remove','');
					id = id.replace(/\s/g, '');		
					var sql = "SELECT id FROM macs WHERE id = '" + id +"'";
					
					db.con.query(sql, function(err, rows) {
						if(rows.length == 1){
							var sql = "UPDATE macs SET user = 'unknown' WHERE id = '" +id +"'";
							db.con.query(sql, function (err, result) {
								if (err) throw err;
							});
							bot.postMessage(current_channel, "removed "+id+" from known devices")
								.always(function(data) {
									console.log(data);
								});
						}
						else{
							bot.postMessage(current_channel, "Does not compute!").always(function(data) {
								console.log(data);
							});
						}
						
					})
		
				}
				if(arr.indexOf('who am i') > -1 || 
					arr.indexOf('whoami') > -1 || 
					arr.indexOf("what's my mac") > -1 
				)
				{
					func.whoAmI(user_id, function(res){
						var message = "Sorry, no devices registered for your account";
						if(res.length == 0){
							bot.postMessage(current_channel, message )
							.always(function(data) {
								console.log(data);
							});
						}
						else{
							message = "Current mac addresses associated with : " + '\n' + res[0].id;
							bot.postMessage(current_channel, message)
							.always(function(data) {
								console.log(data);
							});
						}
					});
					
				}
				if(arr.indexOf('who is here') > -1 || 
					arr.indexOf('whoishere') > -1 || 
					arr.indexOf("who's here") > -1 
				){
					func.whoIsHere(function(res){
						var message =  res[0] + ' guests,' + ' ' + res[1] + ' members'; 
						if(res[1] > 0 ){
							message =  res[0] + ' guests, ' + res[1] + ' ' +  ' members, including'
						}
						bot.postMessage(current_channel, message)
							.always(function(data) {
								console.log(data);
						});
						
					});
				}
				if(arr.indexOf('top') > -1 ){
					var limit = arr.replace('top','');
					limit = limit.replace(/\s/g, '');
					var username = 'unknown';
					func.topUsers(limit, function(res){

						var length = 0;
						if(typeof res == 'undefined' || !res){
                            res = [];
						}
                        var length = res.length;
						var i = 0;
						var message = 'Top '  +length+ ' users:'
						var message_users = '';


                        if(length == 0){
                            bot.postMessage(current_channel, message)
                                .always(function(data) {
                                    console.log(data);
                                });
						}

						res.forEach(function(res_user, id){
							bot.getUsers().then(function(data) {
								data.members.forEach(function(data_user){
									if(data_user.id == res_user.user){
										i++;
										if(!data_user.name){
											username = data_user['profile']['display_name']
										}
										else{
											username = data_user.name
										}
										message_users += '\n'+i+'. '+username+' ('+res_user.minutes+' minutes)'; 
										if(i == length){
											message = message+message_users;
											bot.postMessage(current_channel, message)
												.always(function(data) {
													console.log(data);
												});
										}
									}
								})
							})
						})
					})			
				}
				
				if(arr.indexOf('blacklist ') > -1){
					var id = arr.replace('blacklist ','');
					
					id = id.replace(/\s/g, '');	
					func.blackList(id, function(res){
						var message = '';
						if(res == 1){
							message = 'blacklisted ' + id + ' from known devices';
							bot.postMessage(current_channel, message).always(function(data) {
								console.log(data);
							});
						}
						else{
							message = 'Does not compute!';
							bot.postMessage(current_channel, message).always(function(data) {
								console.log(data);
							});
						}
					})
					
				}

				if(arr.indexOf('help') > -1){
					var message = 'Commands I understand:' + '\n' +
					' - `register xx:xx:xx:xx:xx:xx` to associate yourself with a mac address' + '\n' +
					' - `remove xx:xx:xx:xx:xx:xx` to undo previous association' + '\n' +
					' - `blacklist xx:xx:xx:xx:xx:xx` to blacklist a mac address so it won\'t show up' + '\n' +
					" - `who is here`, `whoishere`, `who's here` I'll let you know who is in the house" + '\n' +
					' - `top x` listing of the most active users 1-10' + '\n' +
					' - `whoami` tells you what mac addresses you have claimed';
					bot.postMessage(current_channel, message).always(function(data) {
								console.log(data);
					});
				}
			}
		}
	});

  });



program
  .command('database')
  .action(() => {
	  require('./db');
  });
  
 program
  .command('scan')
  .action(() => {
	  require('./scanCommand');
  });

program
  .version('1.0.0')
  .option('-o, --option','option description')
  .option('-m, --more','we can have as many options as we want')
  .option('-i, --input [optional]','optional user input')
  .option('-I, --another-input <required>','required user input')
  .parse(process.argv);
