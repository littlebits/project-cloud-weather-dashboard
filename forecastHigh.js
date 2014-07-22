var request = require('request')
var config = require('./config')
var device_id = "XXXXXXXXXXXXXXXXXXXX"



// trigger the function inititally,
get_weather_values();
// then again every 30min
setInterval( get_weather_values, 1800000 );

// function for remapping temperature for servo output

function reMapTemp(tempValue, in_min, in_max, out_min, out_max){
  return (tempValue - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// main function to get weather and ping it to my cloud module
function get_weather_values() {
  console.log('getting current weather');
  var options = {
    url: 'http://api.wunderground.com/api/'+ config.colins_weatherunderground_api_key +'/forecast/q/'+ config.weather_location +'.json',
    json: true
  };
  console.log(options.url);
  var res = request( options, function(err, res, body){
    if (!err && res.statusCode == 200) {

      var forecastHigh = body.forecast.simpleforecast.forecastday[0].high.fahrenheit;
      var output_value;

      if (forecastHigh < 0){
        output_value = 0;
      }
      else if (forecastHigh > 100){
        output_value = 100;
      }
      else {
        output_value = reMapTemp(forecastHigh, 0, 100, 0, 91);
      }


      console.log('sending to cloud module: '+ forecastHigh);

      // send output to littleBits cloud API
      config.output({ device_id: device_id, percent:output_value , duration_ms:-1 }, function (err,res) {
        console.log(err,res);
      });
    } else {
      console.log('oops not ok response!');
    }
  });
}
