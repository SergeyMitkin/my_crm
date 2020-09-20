// Получаем статусы задачи
function getTaskStatuses(id) {

    return jQuery.ajax({
        type: "GET",
        url: "tasks.php",
        data: {
            ajax: "getTaskStatuses",
            task_id: id
        },
    })
        .done(function (response) {
           var obj = jQuery.parseJSON(response);

           // Устанавливаем параметр для фильтра по статусу
           var d_t = document.getElementById("div-task-span_" + id);
            d_t.setAttribute("data-filter-status", obj);
        })
}

function getSelectedRetailpointNames(id) {

    return jQuery.ajax({
        type: "GET",
        url: "tasks.php",
        data: {
            action: "ajax",
            ajax: "getSelectedRetailpointNames",
            task_id: id
        },
    })
        .done(function (response) {
            var obj = jQuery.parseJSON(response);

            var elSpanRetailpointNames = document.getElementById("selected-retailpoint-names_" + id);

            var retailpointNameString = '';
            for (i=0; i<obj.length; i++){
                retailpointNameString +=  ' ' + obj[i]['name'] + ',';
            }

            elSpanRetailpointNames.innerText = retailpointNameString.substring(0, retailpointNameString.length - 1);
        })
}

function getSelectedMarketerNames(id) {

    return jQuery.ajax({
        type: "GET",
        url: "tasks.php",
        data: {
            action: "ajax",
            ajax: "getSelectedMarketerNames",
            task_id: id
        },
    })
        .done(function (response) {
            var obj = jQuery.parseJSON(response);

            var elSpanMarketerNames = document.getElementById("selected-marketer-names_" + id);

            var marketerNameString = '';
            for (i=0; i<obj.length; i++){
                marketerNameString +=  ' ' + obj[i]['name'] + ',';
            }

            elSpanMarketerNames.innerText = marketerNameString.substring(0, marketerNameString.length - 1);
        })
}

function getSelectedRetailpoints(id) {

    return jQuery.ajax({
        type: "GET",
        url: "tasks.php",
        data: {
            action: "ajax",
            ajax: "getSelectedRetailpoints",
            task_id: id
        },
    })
        .done(function (response) {
            var obj = jQuery.parseJSON(response);

            // Устанавливаем параметр для фильтра по статусу
            var d_t = document.getElementById("div-task-span_" + id);
            d_t.setAttribute("data-filter-retailpoint", obj);
        })
}

function getSelectedMarketers(id) {
    return jQuery.ajax({
        type: "GET",
        url: "tasks.php",
        data: {
            action: "ajax",
            ajax: "getSelectedMarketers",
            task_id: id
        },
    })
        .done(function (response) {
            var obj = jQuery.parseJSON(response);

            // Устанавливаем параметр для фильтра по статусу
            var d_t = document.getElementById("div-task-span_" + id);
            d_t.setAttribute("data-filter-marketer", obj);
        })
}

// Получаем список заадч
function getTasks() {

    // ajax-запрос для получения данных выбранной задачи
    var url = "tasks.php";
    var action = "getTasks";

    $.ajax({
        url: url,
        type: "GET",
        data: {
            ajax: action,
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function (response) {
             var obj = jQuery.parseJSON(response); // Задачи

            // Выводим задачи на страницу
            var elDivTaskRow = document.getElementById("manager-task-row");

            for (var i = 0; i < obj.length; i++) {

                var id = obj[i]['id'];
                var title = obj[i]['task_title'];
                var type = obj[i]['type'];
                var deadline = obj[i]['deadline'].substr(0, 10);

                elDivTaskRow.innerHTML += '<div id="div-task-span_' + id
                + '" class="div-task-span imp-close col-md-12"'
                + ' data-filter-type="' +  type
                + '" data-filter-date="' + deadline
                + '" data-filter-status=""'
                + '" data-filter-marketer=""'
                + '" data-filter-retailpoint=""'
                + '">'
                    + '<span id="task_span_' + id
                    + '" class="task-span col-md-4" value="' + id
                    + '">' + title
                    + '</span>'
                    + '</br>'
                    + '<span class="col-md-6">Тип: <span>' + type + '</span></span>'
                    + '</br>'
                    + '<p class="col-md-12">Исполнители: <span id="selected-marketer-names_' + id + '"></span></p>'
                    + '</br>'
                    + '<p class="col-md-12">Магазины: <span id="selected-retailpoint-names_' + id + '"></span></p>'
                    + '</br>'
                    + '<span class="col-md-6">Срок выполнения: <span>' + deadline + '</span></span>'
                    + '<div class="col-md-12" id="task-edit-buttons_' + id
                    + '" align="right">'
                        + '<button type="button" class="btn btn-primary task-edit-button"'
                        + ' id="edit-task-button_' + id
                        + '">Редактировать</button>'
                        + '<button type="button" class="btn btn-danger task-delete-button"'
                        + ' id="delete-task-button_' + id
                        + '">Удалить</button>'
                    +'</div>'
                +'</div>';

                var selectedRetailpointNames = getSelectedRetailpointNames(id);
                var selectedMarketerNames = getSelectedMarketerNames(id);

                var data_status_string = getTaskStatuses(id);
                var data_retailpoint_string = getSelectedRetailpoints(id);
                var data_marketer_string = getSelectedMarketers(id);
            }

            // Прикрепляем функцию редактирования
            var elEditButtons = document.querySelectorAll(".task-edit-button");
            elEditButtons.forEach( elem => {
                elem.addEventListener('click', event =>{
                taskEdit(elem.attributes["id"].value.split("_")[1])
                })
            })

            // Прикрепляем функцию удаления
            var elDeleteButtons = document.querySelectorAll(".task-delete-button");
            elDeleteButtons.forEach( elem => {
                elem.addEventListener('click', event =>{
                taskDelete(elem.attributes["id"].value.split("_")[1])
                })
            })

            // Прикрепляем функцию вывода списка реализаций
            var elTaskDiv = document.querySelectorAll(".div-task-span");
            elTaskDiv.forEach( elem => {
                elem.addEventListener('click', event =>{
                    if (!event.currentTarget.classList.contains("imp-open")) {
                        // Список не выводится, если кликнули на кнопку
                        if (event.target.tagName !== "BUTTON") {
                            implementationList(elem.attributes["id"].value.split("_")[1]);
                        }
                    }
                })
            })
        }
    })
}

$(document).ready(function () {
    $("#href-tab-4").on('click', function () {

        $("#manager-task-row").empty(); // Очищаем div с задачами

        getTasks();
    })
})