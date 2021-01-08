$('document').ready(handleReady);

function handleReady() {
    $(document).on('click', 'button', submitForm)
}

function submitForm() {
    console.log($('input').val())
}