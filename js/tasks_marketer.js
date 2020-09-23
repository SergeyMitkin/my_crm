function changeStatusCompleted(id) {

    var action = "changeStatus";

    var retailpoint_id = 80198; // Магазин по умолчанию

    // Определяем исполнителя
    var elSelectedMarketer = document.getElementById("select-assigned-marketer_" + id).options.selectedIndex;
    var marketer_id = document.getElementById("select-assigned-marketer_" + id).options[elSelectedMarketer].value;

    var status = 'completed';

    $.ajax({
        url: 'tasks.php',
        type: "POST",
        data: {
            ajax: action,
            task_id: id,
            marketer_id: marketer_id,
            retailpoint_id: retailpoint_id,
            status: status
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function () {
            var statuses = getTaskStatusesWithMarketerNames(id);
            $("#select-assigned-marketer_" + id).empty();
            var assigned_marketers = getAssignedMarketers(id);
        },
        complete: function () {
            alert("Статус задачи изменён");
        }
    })
}

function changeStatusClarification(id) {

    var action = "changeStatus";

    var retailpoint_id = 80198; // Магазин по умолчанию

    // Определяем исполнителя
    var elSelectedMarketer = document.getElementById("select-assigned-marketer_" + id).options.selectedIndex;
    var marketer_id = document.getElementById("select-assigned-marketer_" + id).options[elSelectedMarketer].value;

    var status = 'clarification';

    $.ajax({
        url: 'tasks.php',
        type: "POST",
        data: {
            ajax: action,
            task_id: id,
            marketer_id: marketer_id,
            retailpoint_id: retailpoint_id,
            status: status
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function () {
           var statuses = getTaskStatusesWithMarketerNames(id);
        },
        complete: function () {
            alert("Статус задачи изменён");
        }
    })
}

function changeStatusAccepted(id) {

    var action = "changeStatus";

    var retailpoint_id = 80198; // Магазин по умолчанию

    // Определяем исполнителя
    var elSelectedMarketer = document.getElementById("select-assigned-marketer_" + id).options.selectedIndex;
    var marketer_id = document.getElementById("select-assigned-marketer_" + id).options[elSelectedMarketer].value;

    var status = 'accepted';

    $.ajax({
        url: 'tasks.php',
        type: "POST",
        data: {
            ajax: action,
            task_id: id,
            marketer_id: marketer_id,
            retailpoint_id: retailpoint_id,
            status: status
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function () {
            var statuses = getTaskStatusesWithMarketerNames(id);
        },
        complete: function () {
            alert("Статус задачи изменён");
        }
    })

}

function getAssignedMarketers(id) {

    return jQuery.ajax({
        type: "GET",
        url: "tasks.php",
        data: {
            action: "ajax",
            ajax: "getAssignedMarketers",
            task_id: id
        },
    })
        .done(function (response) {
            var obj = jQuery.parseJSON(response);

            var selectAssignedMarketer = document.getElementById("select-assigned-marketer_" + id);

            for (i=0; i<obj.length; i++){
                selectAssignedMarketer.innerHTML +=
                '<option value="' + obj[i]['id'] + '">' + obj[i]['name'] + '</option>'
            }
        })
}

// Получаем статусы с именами исполнителей
function getTaskStatusesWithMarketerNames(task_id) {

    return jQuery.ajax({
        type: "GET",
        url: "tasks.php",
        data: {
            ajax: "getTaskStatusesWithMarketerNames",
            task_id: task_id
        },
    })
        .done(function (response) {
            var obj = jQuery.parseJSON(response);
            var olId = "task-marketer-statuses_" + task_id;
            var elOl = document.getElementById(olId);
            elOl.innerHTML = "";

            if (obj !== null){
                $.each(obj, function(index, value) {
                    $('#' + olId).append('<li>' + index + ': ' + value +
                        '</li>')
                });
            }
        })
}

// Получаем задачи по дате
function getTasksByDate(task_date) {

    // ajax-запрос для получения данных выбранной задачи
    var url = "tasks.php";
    var action = "getTasksByDate";

    $.ajax({
        url: url,
        type: "GET",
        data: {
            ajax: action,
            date: task_date,
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function (response) {
            var obj = jQuery.parseJSON(response); // Задачи

            // Выводим задачи на страницу
            var elDivTaskRow = document.getElementById("marketer-tasks-row");

            for (var i = 0; i < obj.length; i++) {
                var task_id = obj[i]['id'];
                var task_title = obj[i]['task_title'];
                var deadline = obj[i]['deadline'].substr(0, 10);
                var type = obj[i]['type'];

                elDivTaskRow.innerHTML += '<div id="div-task-span_' + task_id
                + '" class="div-task-span col-md-12 task-marketer" '
                //+ ' data-toggle="modal" data-target="#taskModal"' +
                  +  '>'
                    + '<span id="task-span_' + task_id
                    + '" class="task-span col-md-12" value="' + task_id
                    + '">' + task_title
                    + '</span>'
                    + '</br>'
                    + '<span class="col-md-12">Тип: <span>' + type + '</span></span>'
                    + '</br>'
                    + '<p class="col-md-12">Статусы: </p>'
                    + '<ol id="task-marketer-statuses_' + task_id + '"></ol>'
                    + '<span class="col-md-12">Срок выполнения: <span>' + deadline + '</span></span>'
                    + '</br></br>'
                    + '<div id="change-status-div_' + task_id + '" class="col-md-12 change-status-div">'
                        + '<p>Изменить статус</p>'
                        + '<select id="select-assigned-marketer_' + task_id + '" class="choose-assigned-marketer"></select>'
                        + '<button id="clarification-button_' + task_id + '" class="btn btn-warning clarification-button">Требует пояснения</button>'
                        + '<button id="accepted-button_' + task_id + '" class="btn btn-primary accepted-button ">Принята</button>'
                        + '<button id="completed-button_' + task_id + '" class="btn btn-success completed-button">Выполнена</button>'
                    + '</div>'
                + '</div>'

                // Помещаем в select назначенных исполнителей
                var assigned_marketers = getAssignedMarketers(task_id);

                // Выводим аткуальные статусы с именами исполнителей
                var statuses = getTaskStatusesWithMarketerNames(task_id);
            }

            //var elChangeStatusDiv = document.querySelectorAll(".change-status-div");
            var elModalShow = document.querySelectorAll(".div-task-span");

            elModalShow.forEach( elem => {
                elem.addEventListener('click', event =>{
                    // Модальное окно не выводится, если кликнули на кнопку, select или option
                    if (event.target.tagName !== "BUTTON") {
                        if (event.target.tagName !== "SELECT") {
                            if (event.target.tagName !== "OPTION") {
                                console.log($("#taskModal"));
                                $("#taskModal").modal('show');
                            }
                        }
                    }
                })
            })

            // Прикрепляем функцию подстановки переменных в модальное окно заадчи
            var elTaskDiv = document.querySelectorAll(".div-task-span");
            elTaskDiv.forEach( elem => {
                elem.addEventListener('click', event =>{
                getTaskValues(elem.attributes["id"].value.split("_")[1])
                })
            })

            // Прикрепляем функцию изменения статуса на "Требует пояснения"
            var elClarificationButton = document.querySelectorAll(".clarification-button");
            elClarificationButton.forEach( elem => {
                elem.addEventListener('click', event =>{
                changeStatusClarification(elem.attributes["id"].value.split("_")[1])
                })
            })

            // Прикрепляем функцию изменения статуса на "Принята"
            var elAcceptedButton = document.querySelectorAll(".accepted-button");
            elAcceptedButton.forEach( elem => {
                elem.addEventListener('click', event =>{
                changeStatusAccepted(elem.attributes["id"].value.split("_")[1])
                })
            })

            // Прикрепляем функцию изменения статуса на "Выполнена"
            var elAcceptedButton = document.querySelectorAll(".completed-button");
            elAcceptedButton.forEach( elem => {
                elem.addEventListener('click', event =>{
                changeStatusCompleted(elem.attributes["id"].value.split("_")[1])
                })
            })
        }
    })
}

$(document).ready(function () {
    $("#href-tab-3").on('click', function () {
        $("#marketer-active-href").text("3"); // Календарь работает со страницей "Задачи"
        $("#marketer-tasks-row").empty(); // Очищаем div с задачами

        var myDate = new Date();
        var day = myDate.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        var month_l = myDate.getMonth();
        if (month_l == 12){
            var month = 0;
        } else {
            var month = month_l + 1;
        }
        if (month < 10) {
            month = "0" + month;
        }
        var year = myDate.getFullYear();
        var today = year + '-' + month + '-' + day;

        // Показываем текущую дату
        var today_string = day + '-' + month + '-' + year;

        var elTaskDateSpan = document.getElementById("task-date-span");
        elTaskDateSpan.textContent = today_string;

        var elTaskTodaySpan = document.getElementById("task-today-span");
        elTaskTodaySpan.textContent = today_string;

        getTasksByDate(today);
    })
    $(".change-status-div").click(function(){
        $("#taskModal").modal('show');
    })
})

$(document).ready(function () {
    $("#href-tab-2").on('click', function () {

        $("#marketer-active-href").text("2");
    })
})

$(document).ready(function () {
    $("#href-tab-1").on('click', function () {

        $("#marketer-active-href").text("1");
    })
})