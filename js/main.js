
var api = require('@littlebits/cloud-http');
var request = require('request')
var configuration = require('./configuration')

function reMapTemp(tempValue, in_min, in_max, out_min, out_max){
  return (tempValue - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var log = function(elemId, type, msg) {
  var elem = document.getElementById(elemId);
  var div = '<div class="alert alert-dismissible alert-' + type +'" role="alert" id="alertCurrentTemp"><p>' + msg + '</p></div>';
  elem.innerHTML = div;
}

var currentTemp = function() {

  var output = api.output.defaults({ access_token: document.getElementById('cloud_api_token').value })
  var device_id = document.getElementById('currentTemp').value;
  var wu_api_key = document.getElementById('weather_underground_key').value;
  var wu_location = document.getElementById('weather_underground_location').value;

  var options = {
    url: 'http://api.wunderground.com/api/'+ wu_api_key +'/conditions/q/'+ wu_location +'.json',
    json: true
  };

  log('alertCurrentTemp', 'info', 'Fetching weather report...');

  var res = request(options, function(err, res, body) {
    if (!err && res.statusCode == 200 && body.current_observation && body.current_observation.temp_f) {

      var currentTemp = body.current_observation.temp_f;
      var output_value;

      if (currentTemp < 0){
        output_value = 0;
      } else if (currentTemp > 100){
        output_value = 100;
      } else {
        output_value = reMapTemp(currentTemp, 0, 100, 0, 91);
      }

      console.log('sending to cloud module: '+ output_value);
      log('alertCurrentTemp', 'info', 'Sending output to bit...');

      // send output to littleBits cloud API
      output({ device_id: device_id, percent: output_value , duration_ms:-1 }, function (err,res) {
        if (err || !res.success) {
          console.log('Error contacting cloud services. Error:', err)
          log('alertCurrentTemp', 'danger', 'Error contacting cloud services. Error: ' + JSON.stringify(err));
        } else {
          console.log('ok!')
          log('alertCurrentTemp', 'success', 'Done! Current Temperature = ' + currentTemp  + ' Bit Output=' + output_value);
        }
      });
    } else {
      console.log('oops not ok response! will try again later... Error: ', err);
      log('alertCurrentTemp', 'danger', 'Error contacting Weather Underground services. Error: ' + JSON.stringify(err));
    }
  })
}

var forecastHigh = function() {

  var output = api.output.defaults({ access_token: document.getElementById('cloud_api_token').value })
  var device_id = document.getElementById('forecastHigh').value;
  var wu_api_key = document.getElementById('weather_underground_key').value;
  var wu_location = document.getElementById('weather_underground_location').value;

  var options = {
    url: 'http://api.wunderground.com/api/'+ wu_api_key +'/forecast/q/'+ wu_location +'.json',
    json: true
  };

  log('alertForecastHigh', 'info', 'Fetching report...');
  console.log('getting current weather from ' + options.url);

  var res = request(options, function(err, res, body){
    if (!err && res.statusCode == 200) {

      var forecastHigh = body.forecast.simpleforecast.forecastday[0].high.fahrenheit;
      var output_value;

      if (forecastHigh < 0) {
        output_value = 0;
      } else if (forecastHigh > 100) {
        output_value = 100;
      } else {
        output_value = reMapTemp(forecastHigh, 0, 100, 0, 91);
      }

      console.log('sending to cloud module: forecast='+ forecastHigh + ' output=' + output_value);
      log('alertForecastHigh', 'info', 'Sending output to bit...');

      // send output to littleBits cloud API
      output({ device_id: device_id, percent:output_value , duration_ms:-1 }, function (err,res) {
        if (err || !res.success) {
          console.log('Error contacting cloud services. Error:', err)
          log('alertForecastHigh', 'danger', 'Error contacting Cloud services. Error: ' + JSON.stringify(err));
        } else {
          console.log('ok!')
          log('alertForecastHigh', 'success', 'Done! Forecast = ' + forecastHigh + ' Bit Output = ' + output_value);
        }
      });
    } else {
      console.log('oops not ok response! will try again later... Error: ', err);
      log('alertForecastHigh', 'danger', 'Error contacting Weather Underground services. Error: ' + JSON.stringify(err));
    }
  });
};

var forecastLow = function() {

  var output = api.output.defaults({ access_token: document.getElementById('cloud_api_token').value })
  var device_id = document.getElementById('forecastLow').value;
  var wu_api_key = document.getElementById('weather_underground_key').value;
  var wu_location = document.getElementById('weather_underground_location').value;

  var options = {
    url: 'http://api.wunderground.com/api/'+ wu_api_key +'/forecast/q/'+ wu_location +'.json',
    json: true
  };

  console.log('getting current weather from ' + options.url);
  log('alertForecastLow', 'info', 'Fetching report...');

  var res = request(options, function(err, res, body){
    if (!err && res.statusCode == 200) {

      var forecastLow = body.forecast.simpleforecast.forecastday[0].low.fahrenheit;
      var output_value;

      if (forecastLow < 0) {
        output_value = 0;
      } else if (forecastLow > 100) {
        output_value = 100;
      } else {
        output_value = reMapTemp(forecastLow, 0, 100, 100, 4);
      }

      console.log('sending to cloud module: forecast='+ forecastLow + ' output=' + output_value);
      log('alertForecastLow', 'info', 'Sending output to bit...');

      // send output to littleBits cloud API
      output({ device_id: device_id, percent:output_value , duration_ms:-1 }, function (err,res) {
        if (err || !res.success) {
          console.log('Error contacting cloud services. Error:', err)
          log('alertForecastLow', 'danger', 'Error contacting Cloud services. Error: ' + JSON.stringify(err));
        } else {
          console.log('ok!')
          log('alertForecastLow', 'success', 'Done! Forecast = ' + forecastLow + ' Bit Output = ' + output_value);
        }
      });
    } else {
      console.log('oops not ok response! will try again later... Error: ', err);
      log('alertForecastLow', 'danger', 'Error contacting Weather Underground services. Error: ' + JSON.stringify(err));
    }
  });
};

var forecastConditions = function() {

  var output = api.output.defaults({ access_token: document.getElementById('cloud_api_token').value })
  var device_id = document.getElementById('forecastConditions').value;
  var wu_api_key = document.getElementById('weather_underground_key').value;
  var wu_location = document.getElementById('weather_underground_location').value;
  
  var options = {
    url: 'http://api.wunderground.com/api/'+ wu_api_key +'/forecast/q/'+ wu_location +'.json',
    json: true
  };

  console.log('getting current weather from ' + options.url);
  log('alertForecastConditions', 'info', 'Fetching report...');

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
      log('alertForecastConditions', 'info', 'Sending output to bit...');

      // send output to littleBits cloud API
      output({ device_id: device_id, percent:output_value , duration_ms:-1 }, function (err,res) {
        if (err || !res.success) {
          console.log('Error contacting cloud services. Error:', err)
          log('alertForecastConditions', 'danger', 'Error contacting Cloud services. Error: ' + JSON.stringify(err));
        } else {
          console.log('ok!')
          log('alertForecastConditions', 'success', 'Done! Forecast = ' + forecast + ' Bit Output = ' + output_value);
        }
      });
    } else {
      console.log('oops not ok response! will try again later... Error: ', err);
      log('alertForecastConditions', 'danger', 'Error contacting Weather Underground services. Error: ' + JSON.stringify(err));
    }
  });
};

var saveSettings = function() {
  var cloud_api_token = document.getElementById('cloud_api_token').value;
  var weather_underground_key = document.getElementById('weather_underground_key').value;
  var weather_underground_location = document.getElementById('weather_underground_location').value;
  var current_temp = document.getElementById('currentTemp').value;
  var forecast_high = document.getElementById('forecastHigh').value;
  var forecast_low = document.getElementById('forecastLow').value;
  var forecast_conditions = document.getElementById('forecastConditions').value;
  
  configuration.saveSettings('cloud_api_token', cloud_api_token);
  configuration.saveSettings('weather_underground_key', weather_underground_key);
  configuration.saveSettings('weather_underground_location', weather_underground_location);
  configuration.saveSettings('current_temp', current_temp);
  configuration.saveSettings('forecast_high', forecast_high);
  configuration.saveSettings('forecast_low', forecast_low);
  configuration.saveSettings('forecast_conditions', forecast_conditions);
};

window.onload = function() {

  document.getElementById('cloud_api_token').value = configuration.readSettings('cloud_api_token') || '';
  document.getElementById('weather_underground_key').value = configuration.readSettings('weather_underground_key') || '';
  document.getElementById('weather_underground_location').value = configuration.readSettings('weather_underground_location') || 'NY/New_York';
  document.getElementById('currentTemp').value = configuration.readSettings('current_temp') || '';
  document.getElementById('forecastHigh').value = configuration.readSettings('forecast_high') || '';
  document.getElementById('forecastLow').value = configuration.readSettings('forecast_low') || '';
  document.getElementById('forecastConditions').value = configuration.readSettings('forecast_conditions') || '';
  
  document.getElementById("btnCurrentTemp").onclick = currentTemp;
  document.getElementById("btnForecastHigh").onclick = forecastHigh;
  document.getElementById("btnForecastLow").onclick = forecastLow;
  document.getElementById("btnForecastConditions").onclick = forecastConditions;
  
  document.getElementById("btnSave").onclick = saveSettings;
};
