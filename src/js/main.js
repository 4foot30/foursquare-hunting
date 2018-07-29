(function(global) {
    let request;
    const resultsDiv = document.querySelector('.results');
    const searchForm = document.querySelector('form');
    const searchFormAction = searchForm.getAttribute('action');
    const searchInput = document.querySelector('input[type=text]');
    const submitButton = document.querySelector('button[type=submit]');

    // Get the Search button working
    submitButton.addEventListener('click', function(e) {
        // Stop the button from submitting the form
        e.preventDefault();
        // If there's something in the search input:
        if (searchInput.value) {
            request = new XMLHttpRequest();
            request.open('POST', searchFormAction);
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify({location: searchInput.value}));
        } else {
            // Prompt the user to type something into the form
            searchInput.focus();
        }
    });

    // Let Faye receive data published by the Node app, for display in the browser
    let broadcastAPIResponse = new Faye.Client('/faye');
    broadcastAPIResponse.subscribe('/apiResponse', displayResponse);

    function displayResponse(_message) {
        // Empty out the results output
        resultsDiv.innerHTML = '';
        // Store the recommended venues
        const results = _message.response.response.group.results;
        // Loop through the venues and draw their information to the screen
        let output = '<div class="row">';
        for (let [index, result] of results.entries()) {
            // Output a photo, if there is one
            let photo = '';
            if (result.photo) {
                const photoPrefix = result.photo.prefix;
                const photoSize = '300x300';
                const photoSuffix = result.photo.suffix;
                photo = `
                    <img class="img-responsive venue__photo" src="${photoPrefix}${photoSize}${photoSuffix}">
                `;
            } else {
                photo = '<img class="img-responsive venue__photo venue__photo--fake" src="https://placeimg.com/300/300/nature/grayscale">';
            }
            output += `
                <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                    <div class="venue">
                        <h4 class="venue__title">${result.venue.name}</h4>
                        ${photo}
                    </div>
                </div>
            `;
            // Force rows at the various breakpoints
            if ((index + 1) % 4 === 0) {
                output += '<div class="clearfix visible-lg"></div>';
            }
            if ((index + 1) % 3 === 0) {
                output += '<div class="clearfix visible-md"></div>';
            }
            if ((index + 1) % 2 === 0) {
                output += '<div class="clearfix visible-sm"></div>';
            }
        }
        output += '</div>';
        resultsDiv.innerHTML = output;
    }

})(window);
