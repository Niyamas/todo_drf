function getCookie(name) {
    /**
     * Django AJAX CSRF token script
     * https://docs.djangoproject.com/en/3.1/ref/csrf/
     */
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

var activeItem = null
var data_snapshot = []

buildList()     /* Fetch data in database when screen loads */

function buildList() {
    /**
     * Fetches what's already in the database.
     */

    var wrapper = document.getElementById('list-wrapper')
    //wrapper.innerHTML = ''

    var url = 'http://localhost:8000/api/task-list/'

    fetch(url)
    .then( (response) => response.json() )
    .then( (data) => {

        console.log('Data:', data)

        for (var index in data) {

            try {
                document.getElementById(`data-row-${index}`).remove()
            }catch (err) {
        
            }

            var title = `<span class="title">${data[index].title}</span>`

            if ( data[index].completed == true ) {
                title = `<s class="title">${data[index].title}</s>`
            }

            var item = `
                <div id="data-row-${index}" class="task-wrapper flex-wrapper">
                    <div style="flex:7">
                        ${title}
                    </div>

                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-info edit">Edit</button>
                    </div>

                    <div style="flex:1">
                        <button class="btn btn-sm btn-outline-dark delete">-</button>
                    </div>
                </div>
            `
            wrapper.innerHTML += item
        }

        if (data_snapshot.length > data.length) {
            for (var i = data.length; i < data_snapshot.length; i++) {
                document.getElementById(`data-row-${i}`).remove()
            }
        }

        data_snapshot = data

        /* Another for-in loop to add click event listeners to the edit, delete and strike/unstrike buttons */
        /* Passes each button elements to its respective function (editItem(), deleteItem(), strikeUnstrike()) */
        for (var index in data) {
            var editBtn = document.getElementsByClassName('edit')[index]
            var deleteBtn = document.getElementsByClassName('delete')[index]
            var title = document.getElementsByClassName('title')[index]         /* title is really strikeUnstrike */

            editBtn.addEventListener('click', ( (item) => {
                return function() {
                    editItem(item)
                }
            })
            (data[index]) )

            deleteBtn.addEventListener('click', ( (item) => {
                return function() {
                    deleteItem(item)
                }
            })
            (data[index]) )

            title.addEventListener('click', ( (item) => {
                return function() {
                    strikeUnstrike(item)
                }
            })
            (data[index]) )

        }

    })
}

var form = document.getElementById('form-wrapper')
form.addEventListener('submit', (e) => {
    /**
     * Event listener for the form submittal button.
     * Uses POST method to create new object.
     */

    e.preventDefault()                      /* Needed for forms, stops from submitting to file */
    console.log('Form submitted')

    //var url = 'http://localhost:8000/api/task-create/'
    var url = 'http://localhost:8000/api/task-list/'

    /* activeItem is not null when user clicks the edit button. When it's clicked, it will update the url to be the correct task when updating that object */
    if (activeItem != null) {
        //var url = `http://localhost:8000/api/task-update/${activeItem.id}/`
        var url = `http://localhost:8000/api/task-detail/${activeItem.id}/`
        //activeItem = null                           /* Set back to null after updating url */
    }

    var title = document.getElementById('title').value

    /* If edit button is clicked, will change method to PUT and allow user to update task title */
    /* If no edit button is clicked, will allow user to instead add a new task */
    if (activeItem != null) {

        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({'title': title})
        })
        .then( (response) => {
            buildList()                                 /* Re-fetch the data after submitting a new object */
            document.getElementById('form').reset()     /* Resets the form after submitting */
        })

        activeItem = null                               /* Set back to null after updating url */

    } else {

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({'title': title})
        })
        .then( (response) => {
            buildList()                                 /* Re-fetch the data after submitting a new object */
            document.getElementById('form').reset()     /* Resets the form after submitting */
        })
    }

  





})

function editItem(item) {
    /**
     * Each item passed is an edit button. That item
     * is linked with a task object, whose title will
     * be pre-populated in the text area when an edit
     * button is clicked.
     */
    console.log('Item clicked: ', item)
    activeItem = item                                               /* Save last object whose edit button was clicked */
    document.getElementById('title').value = activeItem.title       /* Pre-populate the add task text area with the activeItem's title */
}

function deleteItem(item) {
    /**
     * Each item passed is a delete button.
     */
    console.log('Delete clicked')

    //var url = `http://localhost:8000/api/task-delete/${item.id}/`
    var url = `http://localhost:8000/api/task-detail/${item.id}/`

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
        }
    })
    .then( (response) => {
        buildList()                         /* After deleting, rebuild the list */
    })
}

function strikeUnstrike(item) {
    
    console.log('Strike clicked')

    item.completed = !item.completed        /* True to false, false to true each time a title, which is an item is clicked */

    //var url = `http://localhost:8000/api/task-update/${item.id}/`
    var url = `http://localhost:8000/api/task-detail/${item.id}/`

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'title': item.title, 'completed': item.completed})
    })
    .then( (response) => {
        buildList()                         /* After deleting, rebuild the list */
    })
}