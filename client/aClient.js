window.onload = async function() {
    try {
        updateInviteesList(false);
        fillEventCards()
    } catch(e) {
        console.log('page not found', e)
    }
};

let refButton = document.getElementById("refreshEventsBtn");
refButton.addEventListener('click', async function (event) {
fillEventCards()
});

let fillEventCards = async () => {
    try {
        let response = await fetch('http://127.0.0.1:8090/getEvents');
        //eventJSON is the JSON.parse version of the data
        let eventJSON = await response.text();
        let eventObj = JSON.parse(eventJSON);

        let cardsDiv = document.getElementById('eventCardCollection');
        let cardsSidebarDiv = document.getElementById('eventSideBar');
        let cardsHtml, cardsSidebarHtml;

        cardsHtml = eventObj.map(function(anItem, anIndex) {
            let formattedDateTime = formatDateTime(anItem.aDateTime);
            return ('<div class = "col-auto mb-3" id="list-item-'+ anIndex + '">' +
                '<div class = "card" style ="width:18rem">' +
                '<div class="card-header">' +
                formattedDateTime +
                '</div>' +
                '<div class = "card-body">' +
                '<h5 id = "title"'+anIndex+' class = "card-title">' + anItem.eventName + '</h5>' +
                '<p class="card-text">' + anItem.description+'</p>' +
                '<button id="btn'+anIndex+'"class = "inviteeBtn btn btn-primary card-button "> Click here to see those invited.</button>' +
                '</div>' +
                '</div>' +
                '</div>')
        }).join('');


        cardsSidebarHtml = eventObj.map(function(anItem, anIndex) {
            return('<a class="list-group-item list-group-item-action" href="#list-item-'+ anIndex+ '">'+ anItem.eventName  + '</a>')
        }).join('');
        cardsSidebarDiv.innerHTML = cardsSidebarHtml;
        cardsDiv.innerHTML = cardsHtml;

        for (let eventIndex = 0; eventIndex < eventObj.length; eventIndex++) {
            addCardEventListener(eventObj, eventIndex);
        }


    } catch(e) {
        console.log(e);
    }


};

const addCardEventListener = (displayedEvents, cardIndex) => {
  let buttonId = 'btn'+cardIndex;
  document.getElementById(buttonId).addEventListener('click', () => {
      //displayedEvents holds all events currently displayed
      displayPeopleCarousel(displayedEvents, cardIndex)
          .catch(function (error) {
              console.log(error);

          })
  })
};

async function displayPeopleCarousel(displayedEvents, i) {
    try {
        //i is the index value of the card
        //titleIndex is the id of the title
        let titleIndex= 'title'+i;
        var eventTitle = document.getElementById(titleIndex);
        //eventObj is an object with all existing events
        let eventResponse = await fetch('http://127.0.0.1:8090/getEvents');
        let eventJSON = await eventResponse.text();
        let eventObj = JSON.parse(eventJSON);

        //inviteeNameArray holds all invitees of the clicked event
        let inviteeNameArray = [];
        if ((eventObj[i].invitees).length === 1) {
            inviteeNameArray.push(eventObj[i].invitees[0]);

        } else {
            inviteeNameArray = eventObj[i].invitees;
        }

        //peopleObj holds all existing people
        let peopleResponse = await fetch('http://127.0.0.1:8090/getPeople');
        let peopleJSON = await peopleResponse.text();
        let peopleObj = JSON.parse(peopleJSON);

        //peopleDisplayObj is to hold people objects of the invitees of the clicked invitees
        var peopleDisplayObj = [];

        //Go through each invitee and compare to each existing person until match is found
        //inviteeIndex is the index of invitees to the clicked event
        for (var inviteeIndex = 0; inviteeIndex < inviteeNameArray.length; inviteeIndex++) {
            var found = false;
            var peopleIndex = 0;
            //j is the index of all existing people
            while (found === false && peopleIndex < peopleObj.length) {
                if (inviteeNameArray[inviteeIndex] === peopleObj[peopleIndex].fullname
                ) {
                    peopleDisplayObj.push(peopleObj[peopleIndex]);
                    found = true
                } else {
                    peopleIndex = peopleIndex + 1;
                }
            }
            if (found === false) {
                console.log('error- person not found');
            }
        }
        let carouselItemsDiv = document.getElementById('carouselItems');
        let carouselSliderDiv = document.getElementById('carouselSlider');

        let carouselHtml = peopleDisplayObj.map(function(anItem, anIndex) {
            if (anIndex === 0) {
                var activeVal = 'active'
            } else {
                activeVal = ''
            }
            //calculate age of invitee from date of birth
            let age = calcAge(peopleDisplayObj[anIndex].dob);

            return ('<div class="carousel-item '+ activeVal+'">' +
                '<div class="inner">'+
                '<h2>'+peopleDisplayObj[anIndex].fullname+'</h2>'+
                '<h3>Age: '+ age+ '</h3>'+
                '<h3>'+ peopleDisplayObj[anIndex].description +'</h3>'+
                '</div>'+
                '</div>')
        }).join('');

        let carouselSliderHtml = peopleDisplayObj.map(function(anItem, anIndex) {
            if (anIndex === 0) {
                return ('<li data-target="#controls" data-slide-to="0" class="active"></li>')
            } else {
                return('<li data-target="#controls" data-slide-to="'+anIndex+'"></li>')
            }
        }).join('');

        carouselItemsDiv.innerHTML = carouselHtml;
        carouselSliderDiv.innerHTML = carouselSliderHtml

    } catch(err) {
        console.log('error in displayPeopleCarousel: ', err);
    }




};

const calcAge = (dob) => {
    let unformattedDob = new Date(dob);
    let today = new Date();
    var yearsDiff = (today.getTime()-unformattedDob.getTime())/1000;
    yearsDiff /= (60*60*24);
    return Math.abs(Math.round(yearsDiff/365.25));

};

const formatDateTime = (aDateTime) => {
    var aDateTime = aDateTime.split('T');
    var date = aDateTime[0].split('-');
    var time = aDateTime[1].split(':');
    return new Date(date[0], date[1], date[2], time[0], time[1], time[2], 0);
};

const updateInviteesList = async (isNew) => {
    let response = await fetch('http://127.0.0.1:8090/getPeople');
    let peopleJSON = await response.text();
    let peopleObj = JSON.parse(peopleJSON);
    if (isNew === true) {
        var newName = document.getElementById('fullName').value;
        var tempObj = {fullname: newName};
        peopleObj.push(tempObj);
    }
    let inviteesDiv = document.getElementById('someInvitees');
    let inviteesHtml= peopleObj.map(function(anItem, anIndex) {
        return ('<option>'+anItem.fullname+'</option>')}).join('');
    inviteesDiv.innerHTML = inviteesHtml;
    if (isNew) {
        alert('Your new person has been created.');
    }

};

document.getElementById('addEvent').addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log('in the new addEvent aclient.js');
    try {
        let eventName = document.getElementById('anEventName').value;
        let description = document.getElementById('aDescription').value;
        let location = document.getElementById('aLocation').value;
        let aDateTime = document.getElementById('aDateTime').value;
        if (aDateTime.length === 16) {
            aDateTime = aDateTime + ':00';
        }
        let invitees = document.getElementById('someInvitees').value;
        console.log('invitees ', invitees);
        let response = await fetch('http://127.0.0.1:8090/newevent',
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "eventName="+ eventName+
                    "&description="+ description+
                    "&location="+  location+
                    "&aDateTime="+aDateTime+
                    "&invitees="+invitees
                });
        if (!response.ok) {
            throw new Error("problem adding an event "+response.code )
            }
        else {
            alert(`Your event ${eventName}, was added.`)
        }
    }   catch(error) {
        console.log('error: '+ error);
    }
    fillEventCards()
        .then(function(value) {
            console.log('Successfully filled cards');
        })
        .catch = (error) => {
        console.log(error);
    }


});


