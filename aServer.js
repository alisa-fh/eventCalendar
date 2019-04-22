var express = require('express');
var app = express();
app.use(express.urlencoded());
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
var fs = require('fs');
var eventData = require('./eventData.json');
var peopleData = require('./peopleData.json')

app.post('/newevent', urlencodedParser, function(req, resp){
    var anEvent = new Object();
    console.log(req.body);
    anEvent.eventName = req.body.eventName;
    anEvent.description = req.body.description;
    anEvent.location = req.body.location;
    anEvent.aDateTime = req.body.aDateTime;
    anEvent.invitees = req.body.invitees;
    eventData.push(anEvent);
    eventData.forEach(function(item, index, array){
        console.log(item.eventName)
    })
    fs.readFile('eventData.json', 'utf8', function readFileCallback(err, data) {
        if (err){
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            obj.push(anEvent); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('eventData.json', json, 'utf8', callback); // write it back
        }
    })

    console.log('form submitted ' + req.body.eventName);
    resp.send('form submitted 1 ' + anEvent);
})

function callback(err, data) {
    if (err) {
        console.log('Error has occurred ' + err);
    } else {
        console.log('Success file write');
    }
}

app.post('/newperson', urlencodedParser, function(req, resp){
    var aPerson = new Object();
    console.log(req.body);
    aPerson.fullname = req.body.fullname;
    aPerson.description = req.body.description;
    aPerson.dob = req.body.dob;
    peopleData.push(aPerson);
    peopleData.forEach(function(item, index, array){
        console.log(item.fullname)
    })
    fs.readFile('peopleData.json', 'utf8', function readFileCallback(err, data) {
        if (err){
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            obj.push(aPerson); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('peopleData.json', json, 'utf8', callback); // write it back
        }
    })

    console.log('form submitted ' + req.body.fullname);
    resp.send('form submitted 1 ' + aPerson);
})



app.listen(8090);