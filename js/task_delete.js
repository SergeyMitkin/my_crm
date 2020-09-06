// Удаляем задачу

function taskDelete(task_id){

    // ajax-запрос
    var action = "taskDelete";

    $.ajax({
        url: 'auth.php',
        type: "POST",
        data: {
            ajax: action,
            id: task_id,
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function () {

            var task_span_id = "div-task-span_" + task_id;
            var elTaskDiv = document.getElementById(task_span_id);
            elTaskDiv.remove();

        },
        complete: function () {
            alert ("Задача удалена");
        }
        //dataType : "json"
    });
}

$(".task-delete-button").on('click', function () {
    var task_id = this.id.split('_')[1]; // Получаем id задачи из атрибута id кнопки

    taskDelete(task_id); // Функция удаления задачи
})
