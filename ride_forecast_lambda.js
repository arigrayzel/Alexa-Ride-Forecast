'use strict';
var Alexa = require('alexa-sdk');
var https = require("https");



function httpsGet(location, callback) {
    var options = {
        host: 'api.darksky.net',
        //be sure to change *APIKEY* to your Dark Sky api key
		path: '/forecast/*APIKEY*/' + encodeURIComponent(location),
        method: 'GET',
    };

    var req = https.request(options, res => {
        res.setEncoding('utf8');
        var responseString = "";
        
        //accept incoming data asynchronously
        res.on('data', chunk => {
            responseString = responseString + chunk;
        });
        
        //return the data when streaming is complete
        res.on('end', () => {
            console.log(responseString);
            callback(responseString);
        });

    });
    req.end();
}

var handlers = {
    'LaunchRequest': function () {
    this.response.speak("hello");
    
    
    
    this.emit(':responseReady');
    },
    
    'TestIntent': function () {
       this.response.speak("test complete");
       this.emit(':responseReady');
        
    },
   
   
   
   'forecastIntent': function () {

       var location = "45.5231,-122.6765"; //Portland, OR
 
        
        httpsGet(location,  (theResult) => {
                console.log("sent     : " + location);
                console.log("received : " + theResult);
                const forecast = JSON.parse(theResult);
                var windBearing = forecast.currently.windBearing;  
                var windSpeed = forecast.currently.windSpeed;
                var temperature = forecast.currently.temperature;
                var summary = forecast.hourly.summary;
                var windDir = "";
                var precipProbability = forecast.currently.precipProbability;
                
                if (((windBearing <= 360) & (windBearing > 337)) | (windBearing <= 23)){
                  windDir = "North";
                };
                
                 if ((windBearing <= 68) & (windBearing >= 24)){
                  windDir = "Northeast";
                };
                if ((windBearing <= 112) & (windBearing >= 69)){
                  windDir = "East";
                };
                if ((windBearing <= 158) & (windBearing >= 113)){
                  windDir = "Southeast";
                };
                if ((windBearing <= 202) & (windBearing >= 159)){
                  windDir = "South";
                };
                if ((windBearing <= 244) & (windBearing >= 203)){
                  windDir = "Southwest";
                };
                if ((windBearing <= 292) & (windBearing >= 245)){
                  windDir = "West";
                };
                if ((windBearing <= 336) & (windBearing >= 293)){
                  windDir = "Northeast";
                };


                this.response.speak("It looks like a lovely day to ride! The wind is blowing at " + windSpeed + " miles per hour to the  " 
                + windDir + ". The temperature is " + temperature + " degrees. There is a " + precipProbability + " percent chance of precipitation.");
                this.emit(':responseReady');
            });
    
       


    }, 
};




exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
