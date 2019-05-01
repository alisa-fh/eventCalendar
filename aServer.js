/*things to do:
* -create function that fills invitees box with people
* -call above function on page loading and creating event
* -on clicking a card button, get people from event and on client side fill in the carousel
* -search events and display relevant cards
* -set default values for people on carousel
* -search people
* -authentication
 * call client function await post to server*/


var express = require('express');
var app = express();
app.use(express.static('client'));
app.use(express.urlencoded());
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const fs = require('fs');
var eventData = require('./client/eventData.json');
var peopleData = require('./client/peopleData.json');

app.post('/newevent', urlencodedParser,  async function(req, resp){
    console.log('in newevent')
    var anEvent = new Object();
    console.log(req.body);
    anEvent.eventName = req.body.eventName;
    anEvent.description = req.body.description;
    anEvent.location = req.body.location;
    anEvent.aDateTime = req.body.aDateTime;
    anEvent.invitees = req.body.invitees;
    eventData.push(anEvent);

    await fs.readFile('./client/eventData.json', 'utf8',  function readFileCallback(err, data) {
        if (err){
            console.log(err);
        } else {
            var obj = JSON.parse(data); //now it an object
            obj.push(anEvent); //add some data
            var json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('./client/eventData.json', json, 'utf8', callback); // write it back
        }

    });

    console.log('form submitted ' + req.body.eventName);
    resp.status(200).send('Success!');
});

function callback(err, data) {
    if (err) {
        console.log('Error has occurred ' + err);
    } else {
        console.log('Success file write');
    }
}

app.post('/newperson', urlencodedParser, function(req, resp){
    //event.preventDefault()
    var aPerson = new Object();
    aPerson.fullname = req.body.fullname;
    aPerson.description = req.body.description;
    aPerson.dob = req.body.dob;
    peopleData.push(aPerson);
    peopleData.forEach(function(item, index, array){
        console.log(item.fullname)
    });
    fs.readFile('./client/peopleData.json', 'utf8', function readFileCallback(err, data) {
        if (err){
            console.log('error in reading peopleData ',err);
        } else {
            obj = JSON.parse(data); //now it an object
            obj.push(aPerson); //add some data
            json = JSON.stringify(obj); //convert it back to json
            console.log(json);
            fs.writeFile('./client/peopleData.json', json, 'utf8', callback); // write it back
        }
    });

    console.log('form submitted ' + req.body.fullname);
    //refresh invitees list in create event

    resp.status(204).send('person added');
});

app.get('/getEvents', function(req, resp) {
    try {
        resp.send(eventData);

    } catch(err) {
        console.log('error in server getEvents', err);
        resp.status(400).send('');
    }
});

app.get('/getPeople', function(req, resp) {
   try {
       resp.send(peopleData);
   } catch(err) {
       console.log('error in server getPeople', err);
       resp.status(400).send('');
   }
});



app.listen(8090);