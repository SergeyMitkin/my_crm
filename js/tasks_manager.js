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
            var d = document.getElementById("manager-task-row");
            var s = document.createElement("span");
            var d_t = document.createElement("div"); // div задачи

            var d_b_e = document.createElement("div") // div с кнопаками редактирования
            d_b_e.setAttribute("align", "right");
            var b_e = document.createElement("button") // Кнопка "Редактировать"
            b_e.classList = "btn btn-primary task-edit-button";
            b_e.type = "button";
            b_e.textContent = "Редактировать";
            var b_d = document.createElement("button"); // Кнопка "Удалить"
            b_d.classList = "btn btn-danger task-delete-button";
            b_d.type = "button";
            b_d.textContent = "Удалить";

            d_b_e.appendChild(b_e);
            d_b_e.appendChild(b_d);

            d_t.appendChild(s);
            d_t.appendChild(d_b_e);
            d_t.classList="div-task-span col-md-12 imp-close";

            s.classList="task-span col-md-6";

            for (var i = 0; i < obj.length; i++) {

                var id = obj[i]['id'];
                var title = obj[i]['task_title'];
                var type = obj[i]['type'];
                var deadline = obj[i]['deadline'].substr(0, 10);

                d_t.id="div-task-span_" + id;
                d_t.setAttribute("data-filter-type", type);
                d_t.setAttribute("data-filter-date", deadline);

                s.textContent=title;
                s.id="task-span_" + id;

                d_b_e.id="task-edit-buttons_" + id;
                b_e.id="edit-task-button_" + id;
                b_d.id="delete-task-button_" + id;

                d.appendChild(d_t.cloneNode(true));
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
                        // Список не выводится, если кликнули на кнопку или на P
                        if (event.target.tagName !== "BUTTON") {
                            if (event.target.tagName !== "P") {
                                implementationList(elem.attributes["id"].value.split("_")[1]);
                            }
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