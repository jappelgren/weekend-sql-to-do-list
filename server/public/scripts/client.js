$('document').ready(handleReady);

function handleReady() {
    getCategories('category-select');
    getTasks();
    $(document).on('click', '#submit-btn', submitForm);
    $(document).on('click', '.delete-btn', deleteTask);
    $(document).on('click', '.edit-btn', editTask);
}//end handleReady

function getCategories(selectId) {
    $.ajax({
        url: '/categories',
        type: 'GET'
    }).then(function (response) {
        $(`#${selectId}`).empty()
        for (cat of response) {
            $(`#${selectId}`).append(`<option data-index="${cat.id}" value="${cat.category}">${cat.category}</option>`)
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

    let id = $(this).closest('.task').data('id');

    let dataObj = {
        category: $(`#task-info${id} > .cat-icon`).data('category'),
        task: $(`#task-info${id}`).data('task'),
        completeBy: new Date($(`#task-info${id}`).data('complete-by')).toLocaleDateString()
    }
    console.log(dataObj)

    $(this).text('Submit Changes').attr('class', 'changes-btn');
    $(this).next('button').attr('class', 'cancel-btn').text('Cancel Changes')
    $(document).on('click', '.cancel-btn', function () {
        $(this).text('Edit').attr('class', 'edit-btn')
        getTasks();
    })

    $(`#task-info${id}`).empty()
    $(`#task-info${id}`).append(`
        <select name="category" id="category-select-edit">
            <option value="${dataObj.category}">Loading...</option>
        </select>
        <input name="task" type="text" id="task-edit" value="${dataObj.task}"/>
        <input type="date" name="date" id="complete-by-edit" value="${dataObj.completeBy}" />
    `)
    getCategories('category-select-edit');

    $('#category-select-edit').prop('selectedIndex', 2)


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
}//end deleteTask


function renderTasks(data) {
    $('#tasks-display').empty();
    for (item of data) {
        let dateAdded = new Date(item.date_added).toDateString();
        let completeBy = new Date(item.complete_by).toDateString();
        console.log(item)
        console.log(item.task, item.category, item.completed)
        $('#tasks-display').append(`
            <div class="task" data-id="${item.id}">
                <div class="task-info" id="task-info${item.id}" data-task="${item.task}" data-complete-by="${item.complete_by}">
                    <h1 class="cat-icon" data-category="${item.category}">${item.category}</h1>
                    <table>
                        <tr>
                            <td class="task-description">${item.task}</td> 
                        </tr>
                        <tr>
                            <td>Added on:</td>
                            <td>Complete by:</td>
                        </tr>
                        <tr>
                            <td class="date-added">${dateAdded}</td> 
                            <td class="complete-by">${completeBy}</td>
                        </tr>
                    </table>
                </div>
                <div class="task-btns">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>
        `)
    }
}//end renderTasks