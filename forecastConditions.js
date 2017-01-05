var request = require('request')
var config = require('./config')

console.log('getting weather report every 30 minutes...')
// trigger the function inititally,
get_weather_values();
// then again every 30min
setInterval( get_weather_values, 1800000 );


// main function to get weather and ping it to my cloud module
function get_weather_values() {

  var options = {
    url: 'http://api.wunderground.com/api/'+ config.weatherunderground_api_key +'/forecast/q/'+ config.weather_location +'.json',
    json: true
  };

  console.log('getting current weather from ' + options.url);

  var res = request( options, function(err, res, body){
    if (!err && res.statusCode == 200) {
      var forecast = body.forecast.simpleforecast.forecastday[0].icon;
      var output_value;

      switch( forecast ) {
        case 'clear':
        case 'sunny':
          output_value = 0;
          break;
        case 'mostlysunny':
        case 'partlycloudy':
        case 'hazy':
        case 'partlysunny' :
          output_value = 25;
          break;
        case 'cloudy':
        case 'mostlycloudy':
          output_value = 65;
          break;
        case 'chanceflurries':
        case 'chancerain':
        case 'chancesleet':
        case 'chancesnow':
        case 'chancetstorms':
        case 'flurries':
        case 'fog':
        case 'sleet':
        case 'rain':
        case 'snow':
        case 'tstorms':
        case 'unknown':
          output_value = 85;
          break;
        default:
          output_value = 45;
          break;
      }
      console.log('sending to cloud module: forecast='+ forecast + ' output=' + output_value);

      // send output to littleBits cloud API
      config.output({ device_id: config.device_id, percent:output_value , duration_ms:-1 }, function (err,res) {
        if (err || !res.success) {
          console.log('Error contacting cloud services. Error:', err)
        } else {
          console.log('ok!')
        }
      });
    } else {
      console.log('oops not ok response! will try again later... Error: ', err);
    }
  });
}
