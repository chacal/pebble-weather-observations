var UI = require('ui');
var ajax = require('ajax');

var locationOptions = { "timeout": 30000, "maximumAge": 5 * 60 * 1000, "enableHighAccuracy": true };

var main = new UI.Card({
  title: 'Weather',
  icon: 'images/weather.png',
  body: 'Getting location..',
});

main.show();
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);

function locationError(error) {
  main.body('Failed to acquire location');
  console.warn('Location error (' + error.code + '): ' + error.message);
}

function locationSuccess(position) {
  var lat = position.coords.latitude;
  var lon = position.coords.longitude;
 
  main.body('Getting weather data..');
  console.info('Got location:' + lat + ', ' + lon);
  
  ajax(
    {
      url: 'https://tuuleeko.fi/fmiproxy/nearest-observations?lat=' + lat + '&lon=' + lon + '&latest=true', 
      type: 'json'
    },
    showObservation,
    function(err) {
      main.body('Failed to get weather data!');
      console.warn('Failed to get weather data: ', err);
    }
  );  
}

function showObservation(result) {
  main.body(result.station.name + ' @ ' + new Date(result.observations.time).toLocaleTimeString('fi', {hour12: false}) + ':\n' + 
            'Wind: ' + result.observations.windSpeedMs + 'm/s, ' + result.observations.windDir + '°T\n' +
            'Gust: ' + result.observations.windGustMs + 'm/s\n' +
            'Temp: ' + result.observations.temperature + '°C');
  console.info('Got observation: ' + JSON.stringify(result));
}