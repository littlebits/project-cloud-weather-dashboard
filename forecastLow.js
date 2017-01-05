var request = require('request')
var config = require('./config')

console.log('getting weather report every 30 minutes...')
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

  var options = {
    url: 'http://api.wunderground.com/api/'+ config.weatherunderground_api_key +'/forecast/q/'+ config.weather_location +'.json',
    json: true
  };

  console.log('getting current weather from ' + options.url);

  var res = request( options, function(err, res, body){
    if (!err && res.statusCode == 200) {

      var forecastLow = body.forecast.simpleforecast.forecastday[0].low.fahrenheit;
      var output_value;

      if (forecastLow < 0){
        output_value = 0;
      }
      else if (forecastLow > 100){
        output_value = 100;
      }
      else {
        output_value = reMapTemp(forecastLow, 0, 100, 100, 4);
      }

      console.log('sending to cloud module: forecast='+ forecastLow + ' output=' + output_value);

      // send output to littleBits cloud API
      config.output({ device_id: config.device_id, percent:output_value , duration_ms:-1 }, function (err,res) {
        if (err || !res.success) {
          console.log('Error contacting cloud services. Error:', err)
        } else {
          console.log('ok!')
        }
      });
    } else {
      console.log('oops not ok response!');
    }
  });
}
