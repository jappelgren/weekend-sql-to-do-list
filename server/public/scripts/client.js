$('document').ready(handleReady);

function handleReady() {
    $(document).on('click', 'button', submitForm)
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