$('document').ready(handleReady);

function handleReady() {
    getCategories();
    getTasks();
    $(document).on('click', '#submit-btn', submitForm);
    $(document).on('click', '.delete-btn', deleteTask);
    $(document).on('click', '.edit-btn', editTask);
}//end handleReady

function getCategories() {
    $.ajax({
        url: '/categories',
        type: 'GET'
    }).then(function (response) {
        $('#category-select').empty()
        for (cat of response) {
            $('#category-select').append(`<option value="${cat.category}">${cat.category}</option>`)
        }

    }).catch(function (err) {
        console.log(err)
        alert('Error getting data.')
    })
}//end getCategories

function getTasks() {
    $.ajax({
        url: '/tasks',
        type: 'GET'
    }).then(function (response) {
        console.log($('#complete-by').val())
        renderTasks(response)
    }).catch(function (err) {
        console.log(err)
        alert('Error getting data.')
    })
}//end gwtTasks

function submitForm() {
    let taskObj = {
        task: $('#task').val(),
        category: $('#category-select').val(),
        dateAdded: new Date(Date.now()).toLocaleDateString(),
        completeBy: $('#complete-by').val()
    }

    $.ajax({
        url: '/tasks',
        type: 'POST',
        data: taskObj
    }).then(function (response) {
        console.log(response)
        getTasks();
    }).catch(function (err) {
        console.log(err)
    })
}//end submitForm

function editTask() {
    console.log('edit')
}

function deleteTask() {
    $.ajax({
        url: `/tasks/${$(this).closest('div').data('id')}`,
        type: 'DELETE'
    }).then(function (response) {
        getTasks();
    }).catch(function (err) {
        console.log(err)
    })
}


function renderTasks(data) {
    $('#tasks-display').empty();
    for (task of data) {
        let dateAdded = new Date(task.date_added).toDateString();
        let completeBy = new Date(task.complete_by).toDateString();
        console.log(task.task, task.category, task.completed)
        $('#tasks-display').append(`
            <div class="task" data-id="${task.id}">
                <h1>${task.category}</h1>
                <p> * ${task.task} Added on: ${dateAdded} Complete by: ${completeBy}</p>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `)
    }
}//end renderTasks