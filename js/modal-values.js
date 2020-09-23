// Выводим данные задачи в модальном окне

function getTaskValues(task_id) {

    // Помещаем id задачи в скрытый элемент
    var elTaskModalId = document.getElementById("task_modal_id");
    elTaskModalId.textContent = task_id;

    var url = "tasks.php";
    var action = "getTask";

    $.ajax({
        url: url,
        type: "GET",
        data: {
            ajax: action,
            id: task_id,
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function (response) {
            var obj = jQuery.parseJSON(response); // Данные задачи

            var task_title = obj[0][0]['task_title'];
            var task_description = obj[0][0]['task_description'];

            var elTaskModalTitle = document.getElementById("task-modal-title");
            elTaskModalTitle.textContent = task_title;

            var elTaskModalDescription = document.getElementById("task-modal-description");
            elTaskModalDescription.textContent = task_description;
        }
    });
}
