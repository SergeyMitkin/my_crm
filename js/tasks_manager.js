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
           console.log(obj);

           var d_t = document.getElementById("div-task-span_" + id);
            d_t.setAttribute("data-filter-status", obj);

        })
}



// Получаем задачи по дате
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
            var d = document.getElementById("manager-task-row");
            var s = document.createElement("span");
            var d_t = document.createElement("div");

            d_t.appendChild(s);
            d_t.classList="div-task-span col-md-12 imp-close";

            s.classList="task-span col-md-6";

            for (var i = 0; i < obj.length; i++) {

                var id = obj[i]['id'];
                var title = obj[i]['task_title'];
                var type = obj[i]['type'];
                var deadline = obj[i]['deadline'].substr(0, 10);


                //console.log(data_status_string);

                d_t.id="div-task-span_" + id;
                d_t.setAttribute("data-filter-type", type);
                d_t.setAttribute("data-filter-date", deadline);
                d_t.setAttribute("data-filter-status", data_status_string);

                s.textContent=title;
                s.id="task-span_" + id;
                d.appendChild(d_t.cloneNode(true));
                var data_status_string = getTaskStatuses(id);
            }
        }
    })
}

$(document).ready(function () {
    $("#href-tab-4").on('click', function () {

        $("#manager-task-row").empty(); // Очищаем div с задачами

        getTasks();
    })
})