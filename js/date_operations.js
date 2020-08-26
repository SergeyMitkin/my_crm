$('#date').datetimepicker({
    locale: 'ru',
    defaultDate: new Date(),
    format: 'DD.MM.YYYY'
});


$('#date').on("dp.change", function(e) {

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
