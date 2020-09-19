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

            $.each(obj, function(index, value) {
                $('#' + olId).append('<li>' + index + ': ' + value +
                    '</li>')
            });
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
                + ' data-toggle="modal" data-target="#taskModal">'
                    + '<span id="task-span_' + task_id
                    + '" class="task-span col-md-6" value="' + task_id
                    + '">' + task_title
                    + '</span>'
                    + '</br>'
                    + '<span class="col-md-6">Тип: <span>' + type + '</span></span>'
                    + '</br>'
                    + '<p class="col-md-6">Статусы: </p>'
                    + '<ol id="task-marketer-statuses_' + task_id + '"></ol>'
                    + '<span class="col-md-6">Срок выполнения: <span>' + deadline + '</span></span>'
                + '</div>'

                // Выводим аткуальные статусы с именами исполнителей
               var statuses = getTaskStatusesWithMarketerNames(task_id);
            }

            // Прикрепляем функцию подстановки переменныхв модальное окно заадчи
            var elTaskDiv = document.querySelectorAll(".div-task-span");
            elTaskDiv.forEach( elem => {
                elem.addEventListener('click', event =>{
                getTaskValues(elem.attributes["id"].value.split("_")[1])
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