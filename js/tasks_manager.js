$(document).ready(function () {
    // При нажатии кнопки "Создать задачу", показываем форму
    $("#task-create-form-button").on('click', function () {
        var elCreateForm = document.getElementById('div-task-create-form'); // Форма создания задачи
        elCreateForm.removeAttribute("hidden");
    })
    selectStore(); // Множественный выбор магазинов
    selectMarketer(); // Множественный выбор исполнителей
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


// Создаём задачу
$(document).ready(function() {
    var elCreateTaskForm = document.getElementById("task-create-form"); // Форма создания задачи
    selectStore();
    selectMarketer();

    addEvent(elCreateTaskForm, 'submit', function (e) {
        e.preventDefault(); // Останавливаем отправку
        var elements = this.elements; // Элементы формы
        var task_title = elements.task_title.value; // Краткое описание
        var task_type_id = elements.task_type.value.split("_")[2]; // Id типа задачи
        var deadline_value = elements.deadline.value; // Срок исполнения
        var deadline = +new Date(deadline_value) / 1000; // Переводим срок исполнения в Unix
        var store = $("#select-store").val(); // Получаем массив с id выбранных магазинов
        var marketer = $("#select-marketer").val(); // Получаем массив с id выбранных пользователей
        var task_description = elements.task_description.value; // Инструкция по выполнению

        var action = "taskCreate"
        $.ajax({
            url: 'auth.php',
            type: "POST",
            data: {
                ajax: action,
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

                var obj = jQuery.parseJSON(response)[0]; // Данные задачи
                var elTaskRow = document.getElementById("tasks-row");
                var elLastTaskOption = document.createElement("option");

                // Выводим краткое описание последней добавленной задачи
                elLastTaskOption.setAttribute("value", obj['task_id']);
                elLastTaskOption.setAttribute("class", "task-option");
                elLastTaskOption.textContent = obj['task_title'];
                elTaskRow.appendChild(elLastTaskOption); // Добавляем последнюю введённую задачу на страницу

                // Добавляем кнопку "Редактировать"
                var elLastTaskEditButton = document.createElement("button");
                elLastTaskEditButton.setAttribute("type", "button");
                elLastTaskEditButton.setAttribute("class", "btn btn-primary task-edit-button");
                var editButtonId = "edit-task-button_" + obj['task_id'];
                elLastTaskEditButton.setAttribute("id", editButtonId);
                elLastTaskEditButton.textContent = "Редактировать";
                elTaskRow.appendChild(elLastTaskEditButton);

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
                elTaskRow.appendChild(elLastTaskDeleteButton);

                // Перемещвем задачу на 2 строки вниз
                var elBr = document.createElement("br");
                var elBrSecond = document.createElement("br");
                elTaskRow.appendChild(elBr);
                elTaskRow.appendChild(elBrSecond);
            },
            complete: function () {
                alert("Задача добавлена"); // После выполнения запроса, выводим информацию о добавлении задачи
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