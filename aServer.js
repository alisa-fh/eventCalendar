var express = require('express');
var app = express();
app.use(express.urlencoded());
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(bodyParser.urlencoded({extended:false}));
var eventData = require('./eventdata.json');
var peopleData = require('./peopledata.json')

app.post('/newevent', urlencodedParser, function(req, resp){
    var anEvent = new Object()
    anEvent.eventName = req.body.eventName;
    anEvent.description = req.body.description;
    anEvent.location = req.body.location;
    anEvent.time = req.body.time;
    anEvent.invitees = req.body.invitees;
    recipes.push(anEvent);
    recipes.forEach(function(item, index, array){
        console.log(item.title)
    })
    console.log('form submitted ' + req.body.title)
    resp.send('form submitted 1 ' + req.body.title)
})