(function(global) {
    let request;
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

})(window);
