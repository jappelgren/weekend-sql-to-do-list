$('document').ready(handleReady);

function handleReady() {
    getCategories('category-select');
    getTasks();
    $(document).on('click', '#submit-btn', submitForm);
    $(document).on('click', '.delete-btn', deleteTask);
    $(document).on('click', '.edit-btn', editTask);
}//end handleReady

function getCategories(selectId, editCat = null) {
    $.ajax({
        url: '/categories',
        type: 'GET'
    }).then(function (response) {
        $(`#${selectId}`).empty()
        for (cat of response) {
            if (editCat === cat.category) {
                $(`#${selectId}`).append(`<option selected="selected" value="${cat.category}">${cat.category}</option>`)
            } else {
                $(`#${selectId}`).append(`<option value="${cat.category}">${cat.category}</option>`)
            }

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
        completeBy: dateFormatter($(`#task-info${id}`).data('complete-by'))
    }

    $(this).text('Submit Changes').attr('class', 'changes-btn');
    $(this).next('button').attr('class', 'cancel-btn').text('Cancel Changes')

    $(`#task-info${id}`).empty()
    $(`#task-info${id}`).append(`
        <select name="category" id="category-select-edit">
            <option>Loading...</option>
        </select>
        <input name="task" type="text" id="task-edit" value="${dataObj.task}"/>
        <input type="date" name="date" id="complete-by-edit" value="${dataObj.completeBy}" />
    `)
    getCategories('category-select-edit', `${dataObj.category}`);

    $(document).on('click', '.cancel-btn', function () {
        $(this).text('Edit').attr('class', 'edit-btn')
        $(`[value|=${dataObj.category}]`).removeAttr('selected')
        getTasks();
    })
    $(document).on('click', '.changes-btn', submitEdit)

}

function submitEdit() {
    let id = $(this).closest('.task').data('id');

    let dataObj = {
        task: $('#task-edit').val(),
        category: $('#category-select-edit').val(),
        completeBy: $('#complete-by-edit').val()

    }
    console.log(dataObj)

    $.ajax({
        url: `/tasks/${id}`,
        type: 'PUT',
        data: dataObj
    }).then(function (response) {
        getTasks();
        console.log(response)
    }).catch(function (err) {
        console.log(err)
    })
}

function deleteTask() {
    $.ajax({
        url: `/tasks/${$(this).closest('.task').data('id')}`,
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

//The following little chunk of code was found here https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
// It formats the date in a way that can be stored as a value in a <input> with a type of date.
//The function uses the Date constructor to build a date and then checks to see if the day and month have two digits
//if the date is a single digit it concats a 0 in front to make it conform to the yyyy-mm-dd format.
function dateFormatter(date) {
    let newDate = new Date(date),
        month = '' + (newDate.getMonth() + 1),
        day = '' + newDate.getDate(),
        year = newDate.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}//end dateFormatter