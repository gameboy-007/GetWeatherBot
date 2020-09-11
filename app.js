var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/weather', function (req, res) {
 
  var city = req.body.queryResult.parameters.City;
  var codigoCiudad = 0;
  var urlCodigoCiudad = 'http://dataservice.accuweather.com/locations/v1/cities/IN/search?apikey=HUvky50Dmh5P90r5Vhr7HfGxUiuKnHtD&q=' + city;
  console.log('Weather query for ' + city);

  var resWeather = {
    fulfillmentText: ''
  };

  request(urlCodigoCiudad, { json: true }, (err, resp, body) => {    

    if(err){ 
      console.log('Error searching for city');
      console.log(err);
      resWeather.fulfillmentText = 'It was not possible to query your city at this time';
    }
    else{ 

      if(body.length == 0){
        console.log('City not found');
        resWeather.fulfillmentText = 'Your city could not be found, make sure you have entered it correctly';
        res.json(resWeather);
      }
      else{
     
        codigoCiudad = body[0].Key;
       
        var urlClimaCiudad = 'http://dataservice.accuweather.com/currentconditions/v1/' + codigoCiudad + '?apikey=HUvky50Dmh5P90r5Vhr7HfGxUiuKnHtD&language=en-us';
        

        request(urlClimaCiudad, {json: true}, (err2, resp2, body2) => {
          
          if(err2){
            console.log('Problem getting the weather');
            resWeather.fulfillmentText = 'It was not possible to check the weather of your city at this time';
          }

          resWeather.fulfillmentText = 'The temperature of ' + city + ' is ' + body2[0].Temperature.Metric.Value;
          resWeather.fulfillmentText += ' degrees ' + body2[0].WeatherText;          

          res.json(resWeather);
        });
      }
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App running on port 3000');
});
