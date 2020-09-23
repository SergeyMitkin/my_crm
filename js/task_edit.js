// Функция редактирования задачи
function taskEdit(id) {

    var elDivTaskSpan = document.getElementById("div-task-span_" + id);

    // Id предыдущей задачи, на которй была открыта форма редактирования
    var pastTaskId = $("#form-create-task_id").val();

    // Делаем кликабельной предыдущую задачу, если на ней открывали форму редактирования
    if (pastTaskId !== '0') {
        var elDivPastTask = document.getElementById("div-task-span_" + pastTaskId);
        if (elDivPastTask.classList.contains("imp-open")) {
            elDivPastTask.classList.add("imp-close");
            elDivPastTask.classList.remove("imp-open");
        }
    }

    // Делаем неактивной функцию вывода списка реализаций текущей задачи
    elDivTaskSpan.classList.add("imp-open");
    elDivTaskSpan.classList.remove("imp-close");

    // Задаём id кнопке закрытия формы редактирования
    var elButtonClose = document.querySelector(".close-button");
    elButtonClose.setAttribute("id", "b-close-create-form_" + id);

    if (pastTaskId == id && pastTaskId !== '0'){
        $("#div-task-create-form").removeAttr("hidden");

    }else {

        var elTypeSelect = document.getElementById("task-type-select");
        var type_options = '<option class="task-type-option" value="type_1">type 1</option>\n' +
            '<option class="task-type-option" value="type_2">type 2</option>\n' +
            '<option class="task-type-option" value="type_3">type 3</option>\n' +
            '<option class="task-type-option" value="type_4">type 4</option>'
        elTypeSelect.innerHTML = type_options;

        var elCreateForm = document.getElementById('div-task-create-form');

        elDivTaskSpan.appendChild(elCreateForm);

        $("#select-retailpoint").remove(); // Очищаем <select> для выбора магазинов
        $("#checkbox-retailpoint").remove();

        $("#select-marketer").remove(); // Очищаем <select> для выбора исполнителей
        $("#checkbox-marketer").remove();

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
                var elGroupForSelectRetailpoint = document.getElementById("group-for-select-retailpoint");

                elGroupForSelectRetailpoint.innerHTML =
                    '<label for="retailpoint">Выберите магазин</label>' +
                    ' <select required multiple class="form-control mul-select" id="select-retailpoint"></select>' +
                    ' <input type="checkbox" id="checkbox-retailpoint"> Выбрать все';

                var s = document.getElementById("select-retailpoint");

                for (var i = 0; i < retailpoint_data.length; i++) {
                    s.innerHTML +=
                        '<option class="selected-retailpoints" value="' + retailpoint_data[i]['id'] + '">'
                        + retailpoint_data[i]['name'] + '</option>'
                }

                // Помещаем в <select> <option> c данными исполнителей
                var elGroupForSelectMarketer = document.getElementById("group-for-select-marketer");

                elGroupForSelectMarketer.innerHTML =
                    '<label for="marketer">Выберите исполнителя</label>' +
                    ' <select required multiple="multiple" id="select-marketer" class="mul-select"></select>' +
                    ' <input type="checkbox" id="checkbox-marketer" > Выбрать всех';

                var s_m = document.getElementById("select-marketer");
                for (var i = 0; i < marketers_data.length; i++) {

                    s_m.innerHTML +=
                        '<option class="selected-marketers" value="' + marketers_data[i]['id'] + '">' +
                        marketers_data[i]['name']+
                        '</option>>'
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
}

// Скрываем форму создания или редактирования
$(".close-button").on("click", function () {

    var elDivTaskSpan = document.getElementById("div-task-span_" + this.id.split("_", 2)[1]);
    if (elDivTaskSpan.classList.contains("imp-open")){
        elDivTaskSpan.classList.add("imp-close");
        elDivTaskSpan.classList.remove("imp-open");
    }

    $("#div-task-create-form").attr("hidden", "");
})
