// Удаляем задачу

function taskDelete(task_id){

    // ajax-запрос
    var action = "taskDelete";

    $.ajax({
        url: 'auth.php',
        type: "POST",
        data: {
            ajax: action,
            task_id: task_id,
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function (response) {

            //var elTaskRow = document.getElementById("task-row")
            var task_option_id = "div-task-option_" + task_id;
            var elTaskOption = document.getElementById(task_option_id);

            elTaskOption.remove();

           /* var obj = jQuery.parseJSON(response);
            var res = obj['updated_value'];

            // Если задача удалена, перезагружаем страницу
            if (res == "Задача удалена") {
                window.location.reload();
            } else {
                alert('Что-то пошло не так!!!');
            }*/
        },
        complete: function (response) {
            alert ("Задача удалена");
        }
        //dataType : "json"
    });
}

$(".task-delete-button").on('click', function () {
    var task_id = this.id.split('_')[1]; // Получаем id задачи из атрибута id кнопки

    taskDelete(task_id); // Функция удаления задачи
})
