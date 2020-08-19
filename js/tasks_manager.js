$(document).ready(function () {
    // При нажатии кнопки "Создать задачу", показываем форму
    $("#task-create-form-button").on('click', function () {
        // var elCreateFormButton = document.getElementById('task-create-form-button'); // Кнопка "Создать задачу"
        var elCreateForm = document.getElementById('div-task-create-form'); // Форма создания задачи

        elCreateForm.removeAttribute("hidden");
    })
})

// Выбор нескольких или всех магазинов
$(document).ready(function(){
$("#select-store").select2();
$("#checkbox-store").click(function(){
    if($("#checkbox-store").is(':checked') ){
        $("#select-store > option").prop("selected","selected");// Select All Options
        $("#select-store").trigger("change");// Trigger change to select 2
    }else{
        $("#select-store > option").removeAttr("selected");
        $("#select-store").trigger("change");// Trigger change to select 2
    }
});

$("#button").click(function(){
    alert($("#select-store").val());
});

    $("#select-store").select2({
        placeholder: "Выберите магазин", //placeholder
        tags: true,
        tokenSeparators: ['/',',',';'," "],
    });
})

// Выбор нескольких или всех исполнителей
$(document).ready(function(){
$("#select-marketer").select2();
$("#checkbox-marketer").click(function(){
    if($("#checkbox-marketer").is(':checked') ){
        $("#select-marketer > option").prop("selected","selected");// Select All Options
        $("#select-marketer").trigger("change");// Trigger change to select 2
    }else{
        $("#select-marketer > option").removeAttr("selected");
        $("#select-marketer").trigger("change");// Trigger change to select 2
    }
});

$("#button").click(function(){
    alert($("#select-marketer").val());
});

    $("#select-marketer").select2({
        placeholder: "Выберите исполнителя", //placeholder
        tags: true,
        tokenSeparators: ['/',',',';'," "],
    });
})

//var elCreateTaskForm = document.getElementById('task-create-post'); // Форма создания задачи
$(document).ready(function() {
    var elCreateTaskForm = document.getElementById("task-create-form");
    addEvent(elCreateTaskForm, 'submit', function (e) {
        e.preventDefault(); // Останавливаем отправку
        var elements = this.elements; // Элементы формы
        var task_title = elements.task_title.value;
        var task_type = elements.task_type.value;
        var deadline_value = elements.deadline.value;
        var deadline = +new Date(deadline_value) / 1000; // Переводим дату в Unix
        var store = $("#select-store").val(); // Получаем массив с id выбранных магазинов
        var marketer = $("#select-marketer").val(); // Получаем массив с id выбранных пользователей
        var task_description = elements.task_description.value; // Инструкция по выполнению
        // console.log(task_description);

        var action = "taskCreate"
        $.ajax({
            url: 'auth.php',
            type: "POST",
            data: {
                ajax: action,
                task_title: task_title,
                task_type: task_type,
                deadline: deadline,
                store: store,
                marketer: marketer,
                task_description: task_description
            },
            error: function () {
                alert('Что-то пошло не так!');
            },
            success: function (response) {
                alert(response);
                //var obj = jQuery.parseJSON(response); // Данные задачи
                //console.log(response);
                //var task_id = obj['id_task']; // Id задачи
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