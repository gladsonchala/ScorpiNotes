// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    displayNotes();
    displayLinks();
    let searchNoteInput = document.getElementById('search-note-input');
    let searchLinkInput = document.getElementById('search-link-input');

    searchNoteInput.addEventListener('input', function() {
        handleSearch('notes', searchNoteInput.value);
    });
    searchLinkInput.addEventListener('input', function() {
        handleSearch('links', searchLinkInput.value);
    });
});

document.getElementById('add-note-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addNote();
});
document.getElementById('add-link-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addLink();
});

/**
 * Handles search functionality based on user input.
 */
function handleSearch(type, keyword) {
    keyword = keyword.toLowerCase();

    // Perform search based on keyword
    performSearch(keyword, type);
}

/**
 * Adds a new note to storage and refreshes the UI.
 */
function addNote() {
    let noteInput = document.getElementById('note-input');
    let noteTitle = noteInput.value;
    if (noteTitle) {
        let note = { title: noteTitle };
        // Add note to storage
        addNoteToStorage(note);
        // Refresh UI to display the new note
        displayNotes();
        // Clear the input field
        noteInput.value = '';
    }
}

/**
 * Adds a new link to storage and refreshes the UI.
 */
function addLink() {
    let linkInput = document.getElementById('link-input');
    let linkTitle = linkInput.value;
    let linkURL = prompt('Enter link URL:');
    if (linkTitle && linkURL) {
        let link = { title: linkTitle, url: linkURL };
        // Add link to storage
        addLinkToStorage(link);
        // Refresh UI to display the new link
        displayLinks();
        // Clear the input field
        linkInput.value = '';
    }
}

function copyToClipboard(text) {
    // Create a temporary input element
    let tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);

    // Select the text in the input element
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices

    // Copy the selected text to the clipboard
    document.execCommand('copy');

    // Remove the temporary input element
    document.body.removeChild(tempInput);
}


/**
 * Performs search based on a keyword.
 * @param {string} keyword The keyword to search for.
 */
function performSearch(keyword, type) {
    let items = type === 'notes' ? retrieveNotesFromStorage() : retrieveLinksFromStorage();
    let filteredItems = items.filter(item => item.title.toLowerCase().includes(keyword));
    // Display filtered items in the UI
    let itemList = document.getElementById(`${type}-list`);
    itemList.innerHTML = '';
    if (filteredItems.length > 0) {
        filteredItems.forEach((item, index) => {
            let itemElement = document.createElement('div');
            if (type === 'notes') {
                itemElement.textContent = item.title;
            } else {
                let itemAnchor = document.createElement('a');
                itemAnchor.textContent = item.title;
                itemAnchor.href = item.url;
                itemAnchor.target = "_blank";
                itemElement.appendChild(itemAnchor);
            }

            let copyButton = document.createElement('button');
            copyButton.className = 'btn btn-primary';
            copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/></svg>';
            copyButton.addEventListener('click', function() {
                copyToClipboard(item.title);
            });

            let viewMoreButton = document.createElement('button');
            viewMoreButton.className = 'btn btn-secondary';
            viewMoreButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyeglasses" viewBox="0 0 16 16"><path d="M4 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4m2.625.547a3 3 0 0 0-5.584.953H.5a.5.5 0 0 0 0 1h.541A3 3 0 0 0 7 8a1 1 0 0 1 2 0 3 3 0 0 0 5.959.5h.541a.5.5 0 0 0 0-1h-.541a3 3 0 0 0-5.584-.953A2 2 0 0 0 8 6c-.532 0-1.016.208-1.375.547M14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/></svg>';
            viewMoreButton.addEventListener('click', function() {
                // Display the full note text
                itemElement.textContent = item.title;
            });

            let deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger';
            deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/></svg>';
            deleteButton.addEventListener('click', function() {
                if (type === 'notes') {
                    deleteNote(index);
                } else {
                    deleteLink(index);
                }
            });

            itemElement.appendChild(copyButton);
            itemElement.appendChild(viewMoreButton);
            itemElement.appendChild(deleteButton);
            itemList.appendChild(itemElement);
        });
    } else {
        let noItemsMsg = document.createElement('p');
        noItemsMsg.textContent = `No ${type} found.`;
        itemList.appendChild(noItemsMsg);
    }
}


/**
 * Displays notes from storage in the UI.
 */
function displayNotes() {
    // Retrieve notes from storage
    let notes = retrieveNotesFromStorage();

    // Get the notes list element
    let notesList = document.getElementById('notes-list');

    // Clear the notes list
    notesList.innerHTML = '';

    // Add each note to the notes list
    notes.forEach((note, index) => {
        let noteElement = document.createElement('div');
        noteElement.textContent = note.title;

        // Add a copy button
        let copyButton = document.createElement('button');
        copyButton.className = 'btn btn-primary';
        copyButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16"><path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/><path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/></svg>';
        copyButton.addEventListener('click', function() {
            copyToClipboard(note.title);
        });

        // Show only the first few note texts
        let noteText = note.title;
        if (noteText.length > 20) {
            noteText = noteText.substring(0, 20) + '...';
        }
        noteElement.textContent = noteText;

        let viewMoreButton = document.createElement('button');
        viewMoreButton.className = 'btn btn-secondary';
        viewMoreButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyeglasses" viewBox="0 0 16 16"><path d="M4 6a2 2 0 1 1 0 4 2 2 0 0 1 0-4m2.625.547a3 3 0 0 0-5.584.953H.5a.5.5 0 0 0 0 1h.541A3 3 0 0 0 7 8a1 1 0 0 1 2 0 3 3 0 0 0 5.959.5h.541a.5.5 0 0 0 0-1h-.541a3 3 0 0 0-5.584-.953A2 2 0 0 0 8 6c-.532 0-1.016.208-1.375.547M14 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/></svg>';
        viewMoreButton.addEventListener('click', function() {
            // Display the full note text
            noteElement.textContent = note.title;
        });

        let deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/></svg>';
        deleteButton.addEventListener('click', function() {
            deleteNote(index);
        });

        noteElement.appendChild(copyButton);
        noteElement.appendChild(viewMoreButton);
        noteElement.appendChild(deleteButton);
        notesList.appendChild(noteElement);
    });
}




/**
 * Deletes a note from storage and refreshes the UI.
 * @param {number} index The index of the note to delete.
 */
function deleteNote(index) {
    // Retrieve notes from storage
    let notes = retrieveNotesFromStorage();

    // Remove the note at the specified index
    notes.splice(index, 1);

    // Save the updated notes array back to storage
    saveNotesToStorage(notes);

    // Refresh UI to display the updated notes
    displayNotes();
}

/**
 * Adds a note to storage.
 * @param {Object} note The note to add to storage.
 */
function addNoteToStorage(note) {
    // Retrieve notes from storage
    let notes = retrieveNotesFromStorage();

    // Add the new note to the array
    notes.push(note);

    // Save the updated notes array back to storage
    saveNotesToStorage(notes);
}

/**
 * Retrieves notes from storage.
 * @returns {Array} The array of notes from storage.
 */
function retrieveNotesFromStorage() {
    // Retrieve the notes string from storage
    let notesString = localStorage.getItem('notes');

    // Parse the notes string into an array
    let notes = notesString ? JSON.parse(notesString) : [];

    return notes;
}

/**
 * Saves notes to storage.
 * @param {Array} notes The array of notes to save to storage.
 */
function saveNotesToStorage(notes) {
    // Stringify the notes array
    let notesString = JSON.stringify(notes);

    // Save the notes string to storage
    localStorage.setItem('notes', notesString);
}

/**
 * Displays links from storage in the UI.
 */
function displayLinks() {
    // Retrieve links from storage
    let links = retrieveLinksFromStorage();

    // Get the links list element
    let linksList = document.getElementById('links-list');

    // Clear the links list
    linksList.innerHTML = '';

    // Add each link to the links list
    links.forEach((link, index) => {
        let linkContainer = document.createElement('div');

        let linkElement = document.createElement('a');
        linkElement.textContent = link.title;
        linkElement.href = link.url;
        linkElement.target = "_blank";

        let deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"><path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/></svg>';
        deleteButton.addEventListener('click', function() {
            deleteLink(index);
        });

        linkContainer.appendChild(linkElement);
        linkContainer.appendChild(deleteButton);
        linksList.appendChild(linkContainer);
    });

    // Display a message if no links are found
    if (links.length === 0) {
        let noLinksMsg = document.createElement('p');
        noLinksMsg.textContent = 'No links found.';
        linksList.appendChild(noLinksMsg);
    }
}

/**
 * Retrieves links from storage.
 * @returns {Array} The array of links from storage.
 */
function retrieveLinksFromStorage() {
    // Retrieve the links string from storage
    let linksString = localStorage.getItem('links');

    // Parse the links string into an array
    let links = linksString ? JSON.parse(linksString) : [];

    return links;
}

/**
 * Adds a link to storage.
 * @param {Object} link The link to add to storage.
 */
function addLinkToStorage(link) {
    // Retrieve links from storage
    let links = retrieveLinksFromStorage();

    // Add the new link to the array
    links.push(link);

    // Save the updated links array back to storage
    saveLinksToStorage(links);
}

/**
 * Saves links to storage.
 * @param {Array} links The array of links to save to storage.
 */
function saveLinksToStorage(links) {
    // Stringify the links array
    let linksString = JSON.stringify(links);

    // Save the links string to storage
    localStorage.setItem('links', linksString);
}

/**
 * Deletes a link from storage and refreshes the UI.
 * @param {number} index The index of the link to delete.
 */
function deleteLink(index) {
    // Retrieve links from storage
    let links = retrieveLinksFromStorage();

    // Remove the link at the specified index
    links.splice(index, 1);

    // Save the updated links array back to storage
    saveLinksToStorage(links);

    // Refresh UI to display the updated links
    displayLinks();
}