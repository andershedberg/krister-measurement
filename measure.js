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
  pmx.emit('Internval Measurement', {
                            "Timestamp": , timestamp,
                            "mA" : milliampere
                        });
}, 1000);
