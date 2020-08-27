
function getTaskData(task_id) {

    console.log(task_id);
    // ajax-запрос для получения данных выбранной задачи

}

// Выводим данные задачи в модальном окне
$(document).ready(function () {

    function getTaskValues(e) {
        // Получаем id задачи из атрибута id
        var task_id = e.target.id.split("_")[1];

        // Помещаем id задачи в скрытый элемент
        var elTaskModalId = document.getElementById("task_modal_id");
        elTaskModalId.textContent = task_id;

        var url = "auth.php";
        var action = "getTask";

        $.ajax({
            url: url,
            type: "GET",
            data: {
                ajax: action,
                task_id: task_id,
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

                console.log(getTaskData(task_id));

                var elTaskModalDescription = document.getElementById("task-modal-description");
                elTaskModalDescription.textContent = task_description;

            }
        })
    }

// Список задач
    var taskRow = document.getElementById("marketer-tasks-row");

// При клике на задачу, вызываем фукцию подставляющую переменные в модальное окно с карточкой задачи
    taskRow.addEventListener('click', function (e) {
        getTaskValues(e);
    }, true);
})