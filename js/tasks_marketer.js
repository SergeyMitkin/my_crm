// Получаем задачи по дате
function getTasksByDate(task_date) {

    // ajax-запрос для получения данных выбранной задачи
    var url = "auth.php";
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
            var d = document.getElementById("marketer-tasks-row");
            var s = document.createElement("span");
            var d_t = document.createElement("div");
            var d_t_s = document.createElement("div");
            var s_s = document.createElement("span");

            d_t.appendChild(s);
            d_t.appendChild(d_t_s);
            d_t_s.appendChild(s_s);
            d_t.classList="div-task-span col-md-12";
            d_t.setAttribute("data-toggle", "modal");
            d_t.setAttribute("data-target", "#taskModal");
            s.classList="task-span col-md-6";
            d_t_s.classList="col-md-6";

            for (var i = 0; i < obj.length; i++) {
                s.textContent=obj[i]['task_title'];
                s_s.textContent="Статус: "+ obj[i]['status_name'];
                d.appendChild(d_t.cloneNode(true));
            }
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
        var month = myDate.getMonth()+1;
        if (month < 10) {
            month = "0" + month;
        }
        var year = myDate.getFullYear();
        var today = year + '-' + month + '-' + day;

        // Показываем текущую дату
        var elTaskDateSpan = document.getElementById("task-date-span");
        elTaskDateSpan.textContent = day + '-' + month + '-' + year;

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