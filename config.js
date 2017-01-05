var api = require('@littlebits/cloud-http');

module.exports = {
  output: api.output.defaults({ access_token: 'Your cloud API key here' }),
  device_id: 'Device Id here',
  weatherunderground_api_key: 'Weather Undeground API Key here',
  weather_location: 'NY/New_York'
}
