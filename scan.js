var cmd = require('node-cmd');
module.exports = {
  scan: function (callback) {
      cmd.get(
          'arp-scan --localnet',
          function(err, data, stderr){

              var arp_scan = data.split('\n');

              var records = [];
              arp_scan.forEach(function(scan){
                  matches = {};

                  var new_r = /([a-z0-9]{2}:[a-z0-9]{2}:[a-z0-9]{2}:[a-z0-9]{2}:[a-z0-9]{2}:[a-z0-9]{2})\s(.*)/;
                  var a = scan;
                  var scan_string = a.match(new_r);

                  if(scan_string && typeof scan_string[1] !== 'undefined' && typeof scan_string[2] !== 'undefined'){
                      matches.mac = scan_string[1];
                      matches.description = scan_string[2];
                      records.push(matches);
				  }

              })

              callback(records);
          }
      );

}

}