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
        var status_id = document.getElementById("task-modal-status-select").options[elSelectedStatus].value;

        // Магазин по умолчанию
        var store_id = 75538;

        var action = "changeStatus";

        $.ajax({
            url: 'auth.php',
            type: "POST",
            data: {
                ajax: action,
                task_id: task_id,
                marketer_id: marketer_id,
                store_id: store_id,
                status_id: status_id
            },
            error: function () {
                alert('Что-то пошло не так!');
            },
            success: function (response) {

                //var obj = jQuery.parseJSON(response); // Данные новой задачи
                console.log(response);

            }
        })
    })
})

// Вспомогательная функция для добавления обработчика событий
function addEvent (el, event, callback) {
    if ('addEventListener' in el) {                  // Если addEventListener работает
        el.addEventListener(event, callback, false);   // Используем его
    } else {                                         // В противном случае
        el['e' + event + callback] = callback;         // Создаем специальный код для IE
        el[event + callback] = function () {
            el['e' + event + callback](window.event);
        };
        el.attachEvent('on' + event, el[event + callback]); // Используем attachEvent()
    }  // для вызова второй функции, которая потом вызывает первую
}

// Вспомогательная функция для удаления обработчика событий
function removeEvent(el, event, callback) {
    if ('removeEventListener' in el) {                      // If removeEventListener works
        el.removeEventListener(event, callback, false);       // Используем его
    } else {                                                // В противном случае
        el.detachEvent('on' + event, el[event + callback]);   // Создаем специальный код для IE
        el[event + callback] = null;
        el['e' + event + callback] = null;
    }
}