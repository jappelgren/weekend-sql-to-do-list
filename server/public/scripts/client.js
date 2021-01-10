$('document').ready(handleReady);


//oneEditAtATime makes sure there is only one task edit active at a time.  Current edit must be
//completed or canceled before another can be started
function oneEditAtATime() {
    $(document).one('click', '.edit-btn', editTask);
}//end oneEditAtATime


function handleReady() {
    getCategories('category-select');
    getTasks();
    oneEditAtATime();
    $(document).on('click', '#submit-btn', submitForm);
    $(document).on('click', '.delete-btn', deleteTask);
    $(document).on('click', '.complete-btn', completeTask);
    $(document).on('click', '.retry-btn', completeTask);
    $(document).on('click', '.delete-cat', deleteCategory);
    $(document).on('click', '#submit-cat-btn', newCategory);
}//end handleReady

//getTasks gets all tasks stored in the database.
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


//submitForm creates an object from the values in the task inputs and sends that info to the database,
//empties those inputs and calls getTasks.
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
        $('#task').val('')
        $('#complete-by').val('')
        getTasks();
    }).catch(function (err) {
        console.log(err)
    })
}//end submitForm


//editTask changes the selected task to a series of inputs filled with their current values
//it replaces the edit, completed and delete button with a cancel and submit button.  
function editTask() {

    let id = $(this).closest('.task').data('id');

    let dataObj = {
        category: $(`#task-info${id} > .cat-icon`).data('category'),
        task: $(`#task-info${id}`).data('task'),
        completeBy: dateFormatter($(`#task-info${id}`).data('complete-by'))
    }

    $(this).text('Submit Changes').attr('class', 'changes-btn');
    $(this).next('button').attr('class', 'cancel-btn').text('Cancel Changes')

    $(`#task-info${id}`).next().empty().append(` 
        <button><img class="changes-btn" src="./images/iconmonstr-check-mark-4.svg" alt="black Checkmark" /></button>
        <button><img class="cancel-btn" src="./images/iconmonstr-x-mark-4.svg" alt="black Checkmark" /></button>
    `)


    $(`#task-info${id}`).empty();
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
        oneEditAtATime();
    })
    $(document).on('click', '.changes-btn', submitEdit)
}//end editTask

//submitEdit takes the info from editTask and submits it to the database and refreshes task list
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
        oneEditAtATime();
        console.log(response)
    }).catch(function (err) {
        console.log(err)
    })
}//end submitEdit

//completeTask marks tasks as completed.  The complete button will change to a readd button
//which changes the status back to active.
function completeTask() {
    let id = $(this).closest('.task').data('id');
    let completed = !$(this).closest('.task').data('completed')

    if ($(this).hasClass('complete-btn') === true) {
        $(this).removeClass().addClass('retry-btn');
    } else if ($(this).hasClass('retry-btn') === true) {
        $(this).removeClass().addClass('complete-btn');
    }

    let dataObj = {
        completed: `${completed}`

    }

    $.ajax({
        url: `/tasks/${id}`,
        type: 'PUT',
        data: dataObj
    }).then(function (response) {
        getTasks();
    }).catch(function (err) {
        console.log(err)
    })
}

//deleteTask deletes selected task from database.
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

//renderTasks renders all tasks to the dom and does a few conditionals to decide certain values.
//dates are formatted to be more readable.  A check is done to assign category icons.  A check is done
//to see if a task is completed or not.
function renderTasks(data) {
    $('#tasks-display').empty();
    for (item of data) {
        console.log(item.date_added, item.complete_by)

        let dateAdded = new Date(item.date_added).toDateString();
        let completeBy = new Date(item.complete_by).toDateString();
        let completeBtnClass;
        let completeDivClass;
        let completeBtnImage;
        let iconFile;
        let completeByPassed;

        if (item.category === 'Home') {
            iconFile = 'iconmonstr-building-7.svg'
        } else if (item.category === 'Work') {
            iconFile = 'iconmonstr-building-15.svg'
        } else if (item.category === 'School') {
            iconFile = 'iconmonstr-book-3.svg'
        } else if (item.category === 'Urgent') {
            iconFile = 'iconmonstr-warning-1.svg'
        } else {
            iconFile = 'iconmonstr-clipboard-9.svg'
        }

        if (!item.completed) {
            completeBtnClass = 'complete-btn'
            completeDivClass = 'status-active'
            completeBtnImage = 'iconmonstr-check-mark-4.svg'
        } else if (item.completed) {
            completeBtnClass = 'retry-btn'
            completeDivClass = 'status-complete'
            completeBtnImage = 'iconmonstr-undo-5.svg'
        }

        if (item.date_added > item.complete_by) {
            completeByPassed = 'date-expired';
        } else {
            completeByPassed = ' ';
        }

        $('#tasks-display').append(`
            <div class="task ${completeDivClass}" data-id="${item.id}" data-completed="${item.completed}">
                <div class="task-info" id="task-info${item.id}" data-task="${item.task}" data-complete-by="${item.complete_by}">
                    <img src="./images/${iconFile}" class="cat-icon ${item.category}" data-category="${item.category}"/>
                    <table>
                        <tr class="task-row">
                            <td colspan="2" class="task-description">${item.task}</td> 
                        </tr>
                        <tr class="added-completed-row-row">
                            <td class="table-dates">Added on:</td>
                            <td class="table-dates">Complete by:</td>
                        </tr>
                        <tr>
                            <td class="date-added table-dates">${dateAdded}</td> 
                            <td class="complete-by table-dates ${completeDivClass}-td ${completeByPassed}">${completeBy}</td>
                        </tr>
                    </table>
                </div>
                <div class="task-btns">
                    <button class="${completeBtnClass}"><img src="./images/${completeBtnImage}" alt="black Checkmark" /></button>
                    <button class="edit-btn"><img src="./images/iconmonstr-pencil-8.svg" alt="black Checkmark" /></button>
                    <button class="delete-btn"><img src="./images/iconmonstr-trash-can-9.svg" alt="black Checkmark" /></button>
                </div>
            </div>
        `)
    }
}//end renderTasks

//The following little chunk of code was found here https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
//It formats the date in a way that can be stored as a value in a <input> with a type of date.
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

//begin category functions

//getCategories renders the categories in two places, the category select in the submit area and
//in the add category area where categories can be added and deleted. The params are to make sure when tasks
//are edited the selected category matches its current category.
function getCategories(selectId, editCat = null) {
    $.ajax({
        url: '/categories',
        type: 'GET'
    }).then(function (response) {
        $(`#${selectId}`).empty()
        $('#cat-tag-container').empty()
        for (cat of response) {
            if (editCat === cat.category) {
                $(`#${selectId}`).append(`<option selected="selected" value="${cat.category}">${cat.category}</option>`)
            } else {
                $(`#${selectId}`).append(`<option value="${cat.category}">${cat.category}</option>`)
            }
            $('#cat-tag-container').append(`
            <div class="cat-tag" data-id="${cat.id}">
            <p>${cat.category}</p>
            <button class="delete-cat">
              <img
                class="delete-tag-img"
                src="./images/iconmonstr-x-mark-4.svg"
                alt="Black circle with an x in the middle"
              />
            </button>
          </div>
            `)
        }

    }).catch(function (err) {
        console.log(err)
        alert('Error getting data.')
    })
}//end getCategories

//newCategory adds new custom categories to db
function newCategory() {
    let taskObj = {
        category: $('#new-cat-in').val(),
    }

    $.ajax({
        url: '/categories',
        type: 'POST',
        data: taskObj
    }).then(function (response) {
        console.log(response)
        $('#new-cat-in').val('')
        getCategories('category-select');
    }).catch(function (err) {
        console.log(err)
    })
}//end newCategory


//deleteCategory deletes a selected category from db.
function deleteCategory() {
    $.ajax({
        url: `/categories/${$(this).closest('div').data('id')}`,
        type: 'DELETE'
    }).then(function (response) {
        getCategories('category-select');
    }).catch(function (err) {
        console.log(err)
    })
}//end deleteTask