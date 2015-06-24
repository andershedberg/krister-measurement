//We need to write and read in order to set up ADC on BBB
fs = require('fs')

//We need mongodb
var mongodb = require('mongodb');

//pmx is used to send live data to Keymetrics account for debugging
var pmx = require('pmx').init({
    network: true,
    ports: true
});
var probe = pmx.probe();

var milliampere = 0.0; //Variable that holds the current value to be sent to Keymetrics.io and databases.

var metric = probe.metric({
    name  : 'Sensor milliampere',
    value : function() {
        return milliampere;
    }
});

//Turn on the ADC pin muxing
fs.writeFile(" /sys/devices/bone_capemgr.9/slots", "BB-ADC", function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("Wrote so ADC is enabled in filesystem");
}); 

setInterval(function() {
  var timestamp = Math.floor(new Date() / 1000);
  fs.readFile('/sys/bus/iio/devices/iio\:device0/in_voltage1_raw', 'utf8', function (err,data) {
    milliampere = -1;
    if (err) {
      return console.log(err);
    }
    milliampere = 0.06*data;
    console.log("Milliampere: " + milliampere);
  });
  pmx.emit('Interval Measurement', {
    "Timestamp": timestamp,
    "mA" : milliampere
  });

  // Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname
  var uri = 'mongodb://krister:xyzabc@ds027521.mongolab.com:27521/krister-measure';
  mongodb.MongoClient.connect(uri, function(err,db) {
    if (err) { 
      console.log(err);
    } 
    else {
      var measurements = db.collection('measurements');
      measurements.insert({"Timestamp": timestamp, "mA" : milliampere}, function(err,result) {
         if (err) { 
           console.log(err);
         }
         else {
           db.close(function(err) {
             if (err) {
               consle.log(err);
             };
           });
         
         };
       });
    };
  });
}, 1000);

