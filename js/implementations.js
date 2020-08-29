// Меняем статус задачи
$(document).ready(function () {
    $("#edit-task-modal-status-button").on('click', function () {

        var elStatusResponse = document.getElementById("task-modal-status-p"); // Элемент, выводящий информацию об изменении статуса
        var elStatusButton = document.getElementById("edit-task-modal-status-button"); // Кнопка "Изменить статус"
        var elEditStatusForm = document.getElementById("edit-task-modal-status-form"); // Форма изменения статуса
        elEditStatusForm.removeAttribute("hidden");
        elStatusResponse.textContent = "";

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
    var elStatusResponse = document.getElementById("task-modal-status-p"); // Элемент, выводящий информацию об изменении статуса

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
            success: function () {
                elStatusResponse.textContent = "Статус задачи изменён";
                elChangeStatusForm.setAttribute("hidden", " " );
            }
        })
    })
})

// Выводим список реализаций
function implementsList(task_id){
    // Div задачи
    var div_task_span_id = "div-task-span_" + task_id;
    var elTaskDiv = document.getElementById(div_task_span_id);

    // ajax-запрос для получения данных задачи
    var url = "auth.php";
    var action = "getTaskCreateAndDisplayDate";
    $.ajax({
        url: url,
        type: "GET",
        data: {
            ajax: action,
            task_id: task_id
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function (data) {

            var obj = jQuery.parseJSON(data); // Получаем данные задачи

            // Создаём элементы вывода статистики
            var d_i = document.createElement("div");
            d_i.id = "div-implements_" + task_id;
            d_i.classList = "col-md-12";

            var p_c_a = document.createElement("p");
            var s_c_a = document.createElement("span");
            p_c_a.textContent = "Создана: "
            p_c_a.appendChild(s_c_a);
            s_c_a.textContent = obj[0]['created_at'];

            var p_f_d = document.createElement("p");
            var s_f_d = document.createElement("span");
            p_f_d.textContent = "Первое отображение: "
            p_f_d.appendChild(s_f_d);
            s_f_d.textContent = obj[0]['first_display'];

            d_i.appendChild(p_c_a);
            d_i.appendChild(p_f_d);

            elTaskDiv.appendChild(d_i);
        },
    });

    // ajax-запрос для поучения списка реализаций

    var url = "auth.php";
    var action = "getImplements";
    $.ajax({
        url: url,
        type: "GET",
        data: {
            ajax: action,
            task_id: task_id
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function (data) {
            var obj = jQuery.parseJSON(data); // Получаем данные таблицы реализаций

            // Создаём элементы для вывода списка реализаций
            var div_implements_id = "div-implements_" + task_id;
            var elDivImplements = document.getElementById(div_implements_id);

            var elOlTitleP = document.createElement("p");
            elOlTitleP.classList = "col-md-12";
            var elTaskImplementOl = document.createElement("ol");
            elTaskImplementOl.classList= "col-md-12 implements-ol";

            var li = '';
            // Помещаем в <option> статусы
            for (var i = 0; i < obj.length; i++) {
                li += '<li class="col-md-12 implement-li">' +
                    'Магазин: ' + obj[i]['store_name'] + '</br>' +
                    'Исполнитель: ' +obj[i]['marketer_name'] + '</br>' +
                    'Статус: ' + obj[i]['status_name'] + '</br>' +
                    'Дата: ' + obj[i]['created_at']
                '</li>'
            }

            elTaskImplementOl.innerHTML = li;
            elDivImplements.appendChild(elOlTitleP);
            elOlTitleP.textContent = "Реализации: "
            elDivImplements.appendChild(elTaskImplementOl);

            // P "Cкрыть"
            var p_close = document.createElement("p");
            p_close.textContent = "Скрыть";
            p_close.classList = "p-close";
            elDivImplements.appendChild(p_close);

            elTaskDiv.appendChild(elDivImplements);

            // P "Скрыть"
            // Прикрепляем к параграфу функцию скрытия списка реализаций
            addEvent(p_close, 'click', function (e) {
                // Делаем активной кнопку "Реализации"
                var implements_button_id = "task-statement-button_" + task_id;
                var elImplementsButton = document.getElementById(implements_button_id);
                elImplementsButton.removeAttribute("disabled");

                // Очищаем div со списком реализаций
                elTaskDiv.removeChild(elDivImplements);
            })
        }
    })
}


// Выводим список реализаций задачи
$(".task-statement-button").on('click', function () {
    var task_id = this.id.split('_')[1]; // Получаем id задачи из атрибута id кнопки

    $(this).attr("disabled", true);

    implementsList(task_id); // Функция редактирования
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