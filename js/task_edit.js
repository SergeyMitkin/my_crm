// Функция редактирования задачи
function taskEdit(id){

    var elCreateForm = document.getElementById('div-task-create-form');

    var div_task_span_id = "div-task-span_" + id;
    var elDivTaskSpan = document.getElementById(div_task_span_id);
    elDivTaskSpan.appendChild(elCreateForm);

    $("#select-retailpoint").empty(); // Очищаем <select> для выбора магазинов
    $("#select-marketer").empty(); // Очищаем <select> для выбора исполнителей

    elCreateForm.removeAttribute("hidden");

    // Помещаем id задачи в скрытый input
    $("#form-create-task_id").val(id);

    // ajax-запрос для получения данных выбранной задачи
    var url = "tasks.php";
    var action = "getTask";

    $.ajax({
        url: url,
        type: "GET",
        data: {
            ajax: action,
            id: id,
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function (response) {

            // Делаем неактивной функцию вывода списка реализаций
            elDivTaskSpan.classList.add("imp-open");
            elDivTaskSpan.classList.remove("imp-close");

            var obj = jQuery.parseJSON(response); // Данные задачи

            var task_title = obj[0][0]['task_title'];
            var deadline = obj[0][0]['deadline'].split(" ")[0];
            var task_description = obj[0][0]['task_description'];
            var type = obj[0][0]['type'];
            var retailpoint_data = obj[1]; // Все магазины
            var selected_retailpoints = obj[2]; // Выбранные магизины
            var marketers_data = obj[3]; // Все исполнители
            var selected_marketers = obj[4]; // Выбранные исполнители

            // Помещаем в <select> <option> c данными магазинов
            var s = document.getElementById("select-retailpoint");
            var o = document.createElement("option");
            for (var i = 0; i < retailpoint_data.length; i++) {
                o.classList="selected-retailpoints";
                o.value=retailpoint_data[i]['id'];
                o.textContent=retailpoint_data[i]['name'];
                s.appendChild(o.cloneNode(true));
            }

            // Помещаем в <select> <option> c данными исполнителей
            var s_m = document.getElementById("select-marketer");
            var o_m = document.createElement("option");
            for (var i = 0; i < marketers_data.length; i++) {
                o_m.classList="selected-marketers";
                o_m.value=marketers_data[i]['id'];
                o_m.textContent=marketers_data[i]['name'];
                s_m.appendChild(o_m.cloneNode(true));
            }

            // Заполняем значения по умолчанию в полях формы
            $("#task-title-input").val(task_title); // Краткое описание

            $("#task-type-select option").filter(function () {
                return this.textContent == type;
            }).prop('selected', true);

            $("#deadline-input").val(deadline); // Срок выполнения
            $("#task_description_textarea").val(task_description); // Инструкция

            // Магазины
            for (var i = 0; i < selected_retailpoints.length; i++) {
                $('option[class|=selected-retailpoints][value|=' + selected_retailpoints[i]['retailpoint_id'] + ']').attr("selected", "selected");
            }
            selectRetailpoint();

            // Исполнители
            for (var i = 0; i < selected_marketers.length; i++) {
                $('option[class|=selected-marketers][value|=' + selected_marketers[i]['marketer_id'] + ']').attr("selected", "selected");
            }
            selectMarketer();
        }
    })
}

// Редактируем задачу
$(".task-edit-button").on('click', function () {

    var elTypeSelect = document.getElementById("task-type-select");
    var type_options = '<option class="task-type-option" value="type_1">type 1</option>\n' +
        '<option class="task-type-option" value="type_2">type 2</option>\n' +
        '<option class="task-type-option" value="type_3">type 3</option>\n' +
        '<option class="task-type-option" value="type_4">type 4</option>'
    elTypeSelect.innerHTML = type_options;

    var task_id = this.id.split('_')[1]; // Получаем id задачи из атрибута id кнопки
    taskEdit(task_id);
})

// Скрываем форму создания или редактирования
$("#p-close-create-form").on("click", function () {
    $("#div-task-create-form").attr("hidden", "");
})
