$('#date').datetimepicker({
    locale: 'ru',
    defaultDate: new Date(),
    format: 'DD.MM.YYYY'
});

function previousDay(year, month_m, day) {

    var month = 0;

    if (month_m > 0){
        month = month_m - 1;
    } else {
        month = 12;
    }

    var D = new Date(year,month,day);
    D.setDate(D.getDate() - 1);
    return D;
}

function nextDay(year, month_m, day) {

    var month = 0;

    if (month_m > 0){
        month = month_m - 1;
    } else {
        month = 12;
    }

    var D = new Date(year,month,day);
    D.setDate(D.getDate() + 1);
    return D;
}

$("#a-previous-date-page").on("click", function () {

    $("#marketer-tasks-row").empty(); // Очищаем div с задачами
    var initial_date = document.getElementById("task-date-span").textContent;
    var date_array = initial_date.split("-");

    var i_year = date_array[2];
    var i_month_m = date_array[1];
    var i_day = date_array[0];

    var p_d = previousDay(i_year, i_month_m, i_day);

    var day = p_d.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    var month_l = p_d.getMonth();
    if (month_l == 12){
        var month = 0;
    } else {
        var month = month_l + 1;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var year = p_d.getFullYear();
    var previous_day = year + '-' + month + '-' + day;

    // Показываем текущую дату
    var elTaskDateSpan = document.getElementById("task-date-span");
    elTaskDateSpan.textContent = day + '-' + month + '-' + year;

    getTasksByDate(previous_day);
})

$("#a-next-date-page").on("click", function () {

    $("#marketer-tasks-row").empty(); // Очищаем div с задачами
    var initial_date = document.getElementById("task-date-span").textContent;
    var date_array = initial_date.split("-");

    var i_year = date_array[2];
    var i_month_m = date_array[1];
    var i_day = date_array[0];

    var p_d = nextDay(i_year, i_month_m, i_day);

    var day = p_d.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    var month_l = p_d.getMonth();
    if (month_l == 12){
        var month = 0;
    } else {
        var month = month_l + 1;
    }
    if (month < 10) {
        month = "0" + month;
    }
    var year = p_d.getFullYear();
    var previous_day = year + '-' + month + '-' + day;

    // Показываем текущую дату
    var elTaskDateSpan = document.getElementById("task-date-span");
    elTaskDateSpan.textContent = day + '-' + month + '-' + year;

    getTasksByDate(previous_day);
})

$("#a-current-date-page").on("click", function () {

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
    getTasksByDate(today);
})

$('#date').on("dp.change", function() {

    // Если меняем дату на странице задач
    if ($("#marketer-active-href").text() == "3"){

        $("#marketer-tasks-row").empty(); // Очищаем div с задачами

        var elTaskDateSpan = document.getElementById("task-date-span");
        elTaskDateSpan.textContent = $('#date').data("date");

        // Определяем выбранную дату
        var date_array = $('#date').data("date").split(".");
        var task_date = date_array[2] + '-' + date_array[1] + '-' + date_array[0];

        getTasksByDate(task_date); // Получаем задачи на определённую дату
    }

    else {
        var op_type;
        reload_operations($('#date').data("date"));
        op_type = $('#operation').val();
        if(op_type != ''){
            load_report(op_type,$('#date').data("date"));
        }
    }
});

function reload_operations(date) {
    $.ajax({
        url: 'getoperations.php',
        type: 'POST',
        data: 'date=' + date,
        dataType: 'json',
        success: function(response) {
            load_opertaions_response(response);
        },
        error: function(xhr, status, errorThrown) {
            alert(xhr.status + "\r\n" + xhr.responseText + "\r\n" + status + "\r\n" + errorThrown);
        }
    });
}
