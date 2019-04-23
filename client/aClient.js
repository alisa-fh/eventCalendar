document.getElementById("refreshEventsBtn").addEventListener('click', async function (event) {
    try {
        console.log('in refresh events');
        let response = await fetch('http://127.0.0.1:8090/refresh');
        //eventJSON is the JSON.parse version of the data
        let eventJSON = await response.text();

        let cardsDiv = document.getElementById('eventCardCollection');
        let cardsSidebarDiv = document.getElementById('eventSidebar');
        let cardsHtml, cardsSidebarHtml;

        cardsHtml = eventJSON.map(function(anItem, anIndex) {
            return ('<div class = "col-auto mb-3" id="list-item-'+ anIndex + '">' +
                '<div class = "card" style ="width:18rem">' +
                '<div class="card-header">' +
                anItem.aDateTime +
                '</div>' +
                '<div class = "card-body">' +
                '<h5 class = "card-title">' + anItem.eventName + '</h5>' +
                '<p class="card-text">' + anItem.description+'</p>' +
                '<a href="#" class = "btn btn-primary card-button"> Click here to see those invited.</a>' +
                '</div>' +
                '</div>' +
                '</div>')
        }).join('');

        cardsSidebarHtml = eventJSON.map(function(anItem, anIndex) {
            return('<a class="list-group-item list-group-item-action" href="#list-item-'+ anIndex+ '">'+ anItem.eventName  + '</a>')
        }).join('');
        cardsSidebarDiv.innerHTML = cardsSidebarHtml;
        cardsDiv.innerHTML = cardsHtml;

    } catch(e) {
        console.log('page not found');
    }


});
