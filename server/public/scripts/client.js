$('document').ready(handleReady);

function handleReady() {
    getCategories();
    $(document).on('click', 'button', submitForm);
}

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
}

function submitForm() {
    $.ajax({
        url: '/tasks',
        type: 'GET'
    }).then(function (response) {
        renderTasks(response)
    }).catch(function (err) {
        console.log(err)
        alert('Error getting data.')
    })
}

function renderTasks(data) {
    console.log(data)
    for (task of data) {
        console.log(task.task, task.category, task.completed)
    }
}