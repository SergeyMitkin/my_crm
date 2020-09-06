// Меняем статус задачи
$(document).ready(function () {
    $("#edit-task-modal-status-button").on('click', function () {

        var elEditStatusForm = document.getElementById("edit-task-modal-status-form"); // Форма изменения статуса
        elEditStatusForm.removeAttribute("hidden");

        // ajax-запрос для получения исполнителей
        var url = "auth.php";
        var action = "getMarketers";
        $.ajax({
            url: url,
            type: "GET",
            data: {
                ajax: action,
            },
            error: function () {
                alert('Что-то пошло не так!');
            },
            success: function (data) {
                var obj = jQuery.parseJSON(data); // Получаем данные таблицы marketers
                var marketers_number = obj.length; // Количество пользователей

                var elMarketerSelect = document.getElementById('task-modal-marketer-select') // Select для выбора пользователя
                var marketer_options = '<option value = "' + obj[0]['id'] + ' " >' + obj[0]['name'] + '</option>'; // Помещаем исходного ответственного в первый <option>

                // Помещаем в <option> исполнителей
                for (var i = 1; i < marketers_number; i++) {
                    marketer_options += '<option value="' + obj[i]['id'] + '">' + obj[i]['name'] + '</option>';
                }
                elMarketerSelect.innerHTML = marketer_options;

                var elStatusSelect = document.getElementById('task-modal-status-select') // Select для выбора пользователя
                var status_options = '<option class="task-status-option" value="new">Новая</option>' +
                                      '<option class="task-status-option" value="accepted">Принята</option>' +
                                      '<option class="task-status-option" value="clarification">Требует пояснения</option>' +
                                      '<option class="task-status-option" value="completed">Выполнена</option>';

                elStatusSelect.innerHTML = status_options;
            },
        });
    })
})

// Меняем статус задачи
$(document).ready(function() {
    var elChangeStatusForm = document.getElementById("edit-task-modal-status-form"); // Форма создания задачи

    addEvent(elChangeStatusForm, 'submit', function (e) {
        e.preventDefault(); // Останавливаем отправку
        var elements = this.elements; // Элементы формы
        var task_id = elements.task_id.value; // Id задачи

        // Определяем исполнителя
        var elSelectedMarketer = document.getElementById("task-modal-marketer-select").options.selectedIndex;
        var marketer_id = document.getElementById("task-modal-marketer-select").options[elSelectedMarketer].value;

        // Определяем статус
        var elSelectedStatus = document.getElementById("task-modal-status-select").options.selectedIndex;
        var status = document.getElementById("task-modal-status-select").options[elSelectedStatus].text;

        // Магазин по умолчанию
        var retailpoint_id = 80198;

        var action = "changeStatus";

        $.ajax({
            url: 'auth.php',
            type: "POST",
            data: {
                ajax: action,
                task_id: task_id,
                marketer_id: marketer_id,
                retailpoint_id: retailpoint_id,
                status: status
            },
            error: function () {
                alert('Что-то пошло не так!');
            },
            success: function () {
                elChangeStatusForm.setAttribute("hidden", " " );
            },
            complete: function () {
                alert("Статус задачи изменён");
            }
        })
    })
})
