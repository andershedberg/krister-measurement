fs = require('fs')

var pmx = require('pmx').init({
    network: true,
    ports: true
});
var probe = pmx.probe();
var milliampere = 0.0;

var metric = probe.metric({
    name  : 'Sensor milliampere',
    value : function() {
        return milliampere;
    }
});

setInterval(function() {
  milliampere = Math.round(Math.random() * 100);
  var timestamp = Math.floor(new Date() / 1000);
  pmx.emit('Interval Measurement', {
                            "Timestamp": timestamp,
                            "mA" : milliampere
                        });
  fs.readFile('/sys/bus/iio/devices/iio\:device0/in_voltage1_raw', 'utf8', function (err,data) {
    milliampere = -1;
    if (err) {
      return console.log(err);
    }
    console.log(data);
    milliampere = 0.06*data;
    console.log(milliampere);
  });
/*  pmx.emit('Interval Measurement 2', {
                            "Timestamp": timestamp,
                            "mA" : data
                        });
*/
}, 1000);
