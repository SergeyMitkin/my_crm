$(document).ready(function () {
    // При нажатии кнопки "Создать задачу", показываем форму
    $("#task-create-form-button").on('click', function () {

        var elManagerTaskPage = document.getElementById("manager-task-page") // Страница с задачами
        var elCreateForm = document.getElementById('div-task-create-form'); // Форма создания задачи

        // Если форма была открыта для редактирования, перемещаем её наверх страницы
        if ($("#form-create-task_id").val() !== '0') {
            elManagerTaskPage.appendChild(elCreateForm);
        }

        elCreateForm.removeAttribute("hidden"); // Показываем форму

        $('#task-create-form')[0].reset(); // Очищаем значения инпутов формы
        $('#form-create-task_id').val(0); // Id задачи устанавливаем 0
        $('option[value|=option_type_1]').attr("selected", "selected"); // Устанавливаем тип задачи по умолчанию

        $("#select-store").val(''); // Очищаем <select> для выбора магазинов
        $("#select-marketer").val(''); // Очищаем <select> для выбора исполнителей

        selectStore(); // Множественный выбор магазинов
        selectMarketer(); // Множественный выбор исполнителей
    })
})

// Функция множественного выбора в <select>
function multiselect() {
    $("#checkbox-store").click(function(){
        if($("#checkbox-store").is(':checked') ){
            $("#select-store > option").prop("selected","selected");// Select All Options
            $("#select-store").trigger("change");// Trigger change to select 2
        }else{
            $("#select-store > option").removeAttr("selected");
            $("#select-store").trigger("change");// Trigger change to select 2
        }
    });

    $("#checkbox-marketer").click(function(){
        if($("#checkbox-marketer").is(':checked') ){
            $("#select-marketer > option").prop("selected","selected");// Select All Options
            $("#select-marketer").trigger("change");// Trigger change to select 2
        }else{
            $("#select-marketer > option").removeAttr("selected");
            $("#select-marketer").trigger("change");// Trigger change to select 2
        }
    });
}

// Множественный выбор магазинов
function selectStore(){
    $("#select-store").select2();
    multiselect();
    $("#select-store").select2({
        placeholder: "Выберите магазин", //placeholder
        tags: true,
        tokenSeparators: ['/',',',';'," "],
    });
}

// Множественный выбор иполнителей
function selectMarketer(){
    $("#select-marketer").select2();
    multiselect();
    $("#select-marketer").select2({
        placeholder: "Выберите исполнителя", //placeholder
        tags: true,
        tokenSeparators: ['/',',',';'," "],
    });
}

// Создаём или редактируем задачу
$(document).ready(function() {
    var elCreateTaskForm = document.getElementById("task-create-form"); // Форма создания задачи
    selectStore();
    selectMarketer();

    addEvent(elCreateTaskForm, 'submit', function (e) {
        e.preventDefault(); // Останавливаем отправку
        var elements = this.elements; // Элементы формы
        var task_id = elements.task_id.value; // Id задачи
        var task_title = elements.task_title.value; // Краткое описание
        var task_type_id = elements.task_type.value.split("_")[2]; // Id типа задачи
        var deadline_value = elements.deadline.value; // Срок исполнения
        var deadline = +new Date(deadline_value) / 1000; // Переводим срок исполнения в Unix
        var store = $("#select-store").val(); // Получаем массив с id выбранных магазинов
        var marketer = $("#select-marketer").val(); // Получаем массив с id выбранных пользователей
        var task_description = elements.task_description.value; // Инструкция по выполнению

        console.log(task_id);
        var action = "taskCreate"
        $.ajax({
            url: 'auth.php',
            type: "POST",
            data: {
                ajax: action,
                task_id: task_id,
                task_title: task_title,
                task_type_id: task_type_id,
                deadline: deadline,
                store: store,
                marketer: marketer,
                task_description: task_description
            },
            error: function () {
                alert('Что-то пошло не так!');
            },
            success: function (response) {
                var elDivTaskCreateForm = document.getElementById("div-task-create-form"); // Div с формой создания задачи
                elDivTaskCreateForm.setAttribute("hidden", ""); // Скрываем форму создания задачи

                // Создаём атрибуты для вывода новой задачи
                var elTaskRow = document.getElementById("tasks-row");
                var elLastTaskDiv = document.createElement("div"); // Div для новой задачи
                var elLastTaskSpan = document.createElement("span"); // Выводим имя задачи
                var elDivTaskEditButtons = document.createElement("div"); //

                var obj = jQuery.parseJSON(response)[0]; // Данные новой задачи

                // Если задача редактировалась выводим новое описание задачи
                if (task_id>0){
                    var task_span_id = "task_span_" + task_id;
                    document.getElementById(task_span_id).textContent = obj['task_title'];
                }
                // Если создана новая, помещаем её в конец списка
                else {
                    // Добавляем атрибуты в div новой задачи
                    var last_task_div_id = "div-task-span_" + obj['task_id'];
                    elLastTaskDiv.setAttribute("id", last_task_div_id);
                    elLastTaskDiv.setAttribute("class", "div-task-span col-md-12");

                    // Добавляем атрибуты для span с кратким описанием последней добавленной задачи
                    var created_task_id = "task_span_" + obj['task_id'];
                    elLastTaskSpan.setAttribute("value", obj['task_id']);
                    elLastTaskSpan.setAttribute("class", "task-span col-md-6");
                    elLastTaskSpan.setAttribute("id", created_task_id);
                    elLastTaskSpan.textContent = obj['task_title'];

                    // Добавляем кнопку "Редактировать"
                    var div_edit_buttons_id = "task-edit-buttons_" + obj['task_id'];
                    elDivTaskEditButtons.setAttribute("id", div_edit_buttons_id);
                    elDivTaskEditButtons.setAttribute("class", "col-md-6")

                    var elLastTaskEditButton = document.createElement("button");
                    elLastTaskEditButton.setAttribute("type", "button");
                    elLastTaskEditButton.setAttribute("class", "btn btn-primary task-edit-button");
                    var editButtonId = "edit-task-button_" + obj['task_id'];
                    elLastTaskEditButton.setAttribute("id", editButtonId);
                    elLastTaskEditButton.textContent = "Редактировать";

                    // Прикрепляем к кнопке функцию редактирования
                    addEvent(elLastTaskEditButton, 'click', function (e) {
                        var task_id = obj['task_id'];
                        taskEdit(task_id);
                    })

                    // Добавляем кнопку "Удалить"
                    var elLastTaskDeleteButton = document.createElement("button");
                    elLastTaskDeleteButton.setAttribute("type", "button");
                    elLastTaskDeleteButton.setAttribute("class", "btn btn-danger task-delete-button");
                    var deleteButtonId = "delete-task-button_" + obj['task_id'];
                    elLastTaskDeleteButton.setAttribute("id", deleteButtonId);
                    elLastTaskDeleteButton.textContent = "Удалить";

                    // Прикрепляем к кнопке функцию удаления
                    addEvent(elLastTaskDeleteButton, 'click', function (e) {
                        var task_id = obj['task_id'];
                        taskDelete(task_id);
                    })

                    elDivTaskEditButtons.appendChild(elLastTaskEditButton);
                    elDivTaskEditButtons.appendChild(elLastTaskDeleteButton);

                    elLastTaskDiv.appendChild(elLastTaskSpan);
                    elLastTaskDiv.appendChild(elDivTaskEditButtons);

                    elTaskRow.appendChild(elLastTaskDiv);
                }
            },
            complete: function () {
                // После выполнения запроса, выводим информацию о добавлении задачи
                if (task_id>0){
                    alert("Задача отредактирована");
                } else
                {
                    alert("Задача добавлена");
                }
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

// Функция для преобразования Unix timestamp в дату и время
function timestampToDate(unixtimestamp){

    // Convert timestamp to milliseconds
    var date = new Date(unixtimestamp*1000);

    // Year
    var year = date.getFullYear();

    // Month
    var month = ('0'+(date.getMonth()+1)).slice(-2); // Ставим 0 перед месяцем

    // Day
    var day = ('0'+(date.getDate())).slice(-2); // Ставим 0 перед днём

    // Hours
    var hours = date.getHours();

    // Minutes
    var minutes = "0" + date.getMinutes();

    // Seconds
    var seconds = "0" + date.getSeconds();

    // Display date time in yyyy-MM-dd h:m:s format
    var convdataTime = year+'-'+month+'-'+day+' ' +hours+ ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return convdataTime;
}