/*things to do:
* -create function that fills invitees box with people
* -call above function on page loading and creating event
* -on clicking a card button, get people from event and on client side fill in the carousel
* -search events and display relevant cards
* -set default values for people on carousel*/


var express = require('express');
var app = express();
app.use(express.static('client'));
app.use(express.urlencoded());
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended:false});
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
var fs = require('fs');
var eventData = require('./client/eventData.json');
var peopleData = require('./client/peopleData.json');

app.post('/newevent', urlencodedParser,  async function(req, resp){
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

    await fs.readFile('eventData.json', 'utf8',  function readFileCallback(err, data) {
        if (err){
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            obj.push(anEvent); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('eventData.json', json, 'utf8', callback); // write it back
        }

    });

    console.log('form submitted ' + req.body.eventName);
    alert("An event has been added- click refresh to display all events.")
    resp.status(204).send();
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
    });
    fs.readFile('peopleData.json', 'utf8', function readFileCallback(err, data) {
        if (err){
            console.log(err);
        } else {
            obj = JSON.parse(data); //now it an object
            obj.push(aPerson); //add some data
            json = JSON.stringify(obj); //convert it back to json
            fs.writeFile('peopleData.json', json, 'utf8', callback); // write it back
        }
    });

    console.log('form submitted ' + req.body.fullname);
    resp.send('form submitted 1 ' + aPerson);
});

app.get('/refresh', function(req, resp) {
    try {
        resp.send(eventData);

    } catch(err) {
        console.log('error in refresh')
        resp.status(400).send('');
    }
});


/*<a class="list-group-item list-group-item-action" href="#list-item-a">Ali'sa's Partay</a>*/

/*<div class = "col-auto mb-3" id="list-item-1">
    <div class = "card" style ="width:18rem">
    <div class="card-header">
    5th March 2019
</div>
<div class = "card-body">
    <h5 class = "card-title">Ali'sa's Partay</h5>
<p class="card-text">This party bangs. exclusives only.</p>
<a href="#" class = "btn btn-primary card-button">Click here to see those invited.</a>
</div>
</div>
</div>*/

app.listen(8090);