// Меняем статус задачи
$(document).ready(function () {
    $("#edit-task-modal-status-button").on('click', function () {

        var elStatus = document.getElementById("task-modal-status-span"); // Элемент, выводящий статус задачи в модальном окне
        var elStatusButton = document.getElementById("edit-task-modal-status-button"); // Кнопка "Изменить статус"
        var elEditStatusForm = document.getElementById("edit-task-modal-status-form"); // Форма изменения статуса
        elEditStatusForm.removeAttribute("hidden");

        var task_id = document.getElementById("task_modal_id").textContent; // Id задачи

        // ajax-запрос для получения статусов
        var url = "auth.php";
        var action = "getStatuses";
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
                var obj = jQuery.parseJSON(data); // Получаем данные таблицы users
                var statuses_number = obj.length; // Количество пользователей

                var elStatusSelect = document.getElementById('task-modal-status-select') // Select для выбора пользователя
                var options = '<option value = "' + obj[0]['status_id'] + ' " >' + obj[0]['status_name'] + '</option>'; // Помещаем исходного ответственного в первый <option>

                // Помещаем в <option> статусы
                for (var i = 1; i < statuses_number; i++) {
                    options += '<option value="' + obj[i]['status_id'] + '">' + obj[i]['status_name'] + '</option>';
                }
                elStatusSelect.innerHTML = options;

            },
        });

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
                var options = '<option value = "' + obj[0]['id'] + ' " >' + obj[0]['name'] + '</option>'; // Помещаем исходного ответственного в первый <option>

                // Помещаем в <option> исполнителей
                for (var i = 1; i < marketers_number; i++) {
                    options += '<option value="' + obj[i]['id'] + '">' + obj[i]['name'] + '</option>';
                }
                elMarketerSelect.innerHTML = options;

            },
        });




        /*
        var action = "changeStatus";

        $.ajax({
            url: 'index.php',
            type: "POST",
            data: {
                ajax: action,
                id_task: task_id,
                update: 'status',
                initial_value: updated_status_id
            },
            error: function () {
                alert('Что-то пошло не так!');
            },
            success: function (response) {
                // Получаем id задачи и id статуса
                var obj = jQuery.parseJSON(response);

                var task_id = obj['id_task'];
                var status_id = obj['updated_value'];

                // Получаем элемент превью
                var idStatusCardPreview = "status_task_" + task_id;
                var elStatusCardPreview = document.getElementById(idStatusCardPreview);

                var idColumnTask = document.getElementById("column_task_" + task_id); // Получаем id превью задачи

                // Устанавливаем обозначения для обновлённого статуса
                // Если задача "Не выполнена"
                if (status_id == 1) {
                    elStatus.textContent = "выполнена" // Статус в карточке задачи
                    elCompleteButton.textContent = "Не выполнена"; // На кнопке о выполнении
                    elCompleteButton.classList.replace('btn-success', 'btn-warning'); // Стиль для кнопки о выполнении
                    elStatusCardPreview.setAttribute('src', 'img/completed.png'); // Значок о выполнении в превью задачи
                    idColumnTask.setAttribute("data-sortStatus", "выпонена"); // Обновляем параметр для сортировки
                } else {
                    elStatus.textContent = "не выполнена"; // Статус в карточке задачи
                    elCompleteButton.textContent = "Выполнена"; // На кнопке о выполнении
                    elCompleteButton.classList.replace('btn-warning', 'btn-success'); // Стиль для кнопки о выполнении
                    elStatusCardPreview.setAttribute('src', 'img/uncompleted.png'); // Значок о выполнении в превью задачи
                    idColumnTask.setAttribute("data-sortStatus", "не выполнена"); // Обновляем параметр для сортировки
                }
            },
            //dataType : "json"
        });
        */
    })
})