require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');

app.get('/', function(req, res){
  res.send({"message":"This is the Home Page, go to /exrate route!"});
  console.log("home page route accessed")
})

app.get('/exrate', function(req, res){

  var startAt = req.query.startDate; 
  var endAt = req.query.endDate;

  var startDate = new Date(startAt);
  var endDate = new Date(toString(endAt));
  var compareDate = new Date("2000-01-01");
  var todayDate = new Date();

  if(startDate < compareDate && endDate > todayDate){
    res.json({"error":"Please enter a Date between 2000-01-01 and Today"});
  }

  var symbols = req.query.symbols;

  axios.get(process.env.API_LINK+"/history?start_at="+startAt+"&end_at="+endAt+"&symbols="+symbols)
  .then(function (response) {
    // res.send(response.data);
    var jsonData = response.data.rates;
    
    var currencies = symbols.split(",");
    const keys = Object.entries(jsonData)

    var result ={};

    for (index = 0; index < currencies.length; index++) {
      var temp = 0; 

      keys.forEach(([key, value]) => {      
        temp = temp + value[currencies[index]];
  
      });

      result[currencies[index]] = (temp/keys.length).toFixed(2);
  }

    var exrates = {"exchangeRates":result};
    res.send(exrates);
    console.log("Exchange rates requested for => "+ currencies);

  })
  .catch(function (error) {
    res.send(error);
  })
})

app.listen(process.env.PORT, () => {
  console.log('server started at port '+process.env.PORT);
});

