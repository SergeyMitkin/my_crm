// Редактируем задачу
$(document).ready(function() {
    $(".task-edit-button").on('click', function () {
        // Открываем форму создания задачи
        var elCreateForm = document.getElementById('div-task-create-form');
        elCreateForm.removeAttribute("hidden");

        // Скрываем кнопку "Создать задачу"
        var elTaskCreateButton = document.getElementById("div-task-create-button");
        elTaskCreateButton.setAttribute("hidden", "");
        //console.log(elTaskCreateFormButton);

        // ajax-запрос для получения данных выбранной задачи
        var task_id = this.id.split('_')[1]; // Получаем id задачи из атрибута id кнопки
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
                var obj = jQuery.parseJSON(response)[0]; // Данные задачи

                var task_id = obj['task_id'];
                var task_title = obj['task_title'];
                var deadline = timestampToDate(obj['deadline']).substr(0, 10);
                var task_description = obj['task_description'];

                // Заполняем значения по умолчанию в полях формы
                $("#task-title-input").attr("value", task_title);
                $("#deadline-input").val(deadline);
                $("#task_description_textarea").val(task_description);

                //console.log(deadline);
            }

        })
        var elCreateTaskForm = document.getElementById("task-create-form"); // Форма создания задачи
        var elSelectedMarketer = document.getElementById("select-marketer") // select marketer
        var marketerOptions = '<option></option>'

    })
})