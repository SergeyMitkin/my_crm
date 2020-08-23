// Функция редактирования задачи
function taskEdit(task_id){

    var elCreateForm = document.getElementById('div-task-create-form');
    elCreateForm.removeAttribute("hidden");

    // Скрываем кнопку "Создать задачу"
    var elTaskCreateButton = document.getElementById("div-task-create-button");
    elTaskCreateButton.setAttribute("hidden", "");

    // Помещаем id задачи в скрытый input
    $("#form-create-task_id").val(task_id);

    // ajax-запрос для получения данных выбранной задачи
    var url = "auth.php";
    var action = "getTask";

    $.ajax({
        url: url,
        type: "GET",
        data: {
            ajax: action,
            task_id: task_id,
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function (response) {
            var obj = jQuery.parseJSON(response); // Данные задачи

            var task_title = obj[0][0]['task_title'];
            var deadline = timestampToDate(obj[0][0]['deadline']).substr(0, 10);
            var task_description = obj[0][0]['task_description'];
            var task_type_id = obj[0][0]['task_type_id'];
            var stores_data = obj[1]; // Все магазины
            var selected_stores = obj[2]; // Выбранные магизины
            var marketers_data = obj[3]; // Все исполнители
            var selected_marketers = obj[4]; // Выбранные исполнители

            // Помещаем в <select> <option> c данными магазинов
            var s = document.getElementById("select-store");
            var o = document.createElement("option");
            for (var i = 0; i < stores_data.length; i++) {
                o.classList="selected-stores";
                o.value=stores_data[i]['id'];
                o.textContent=stores_data[i]['name'];
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
            $('option[value|=option_type_' + task_type_id + ']').attr("selected", "selected"); // Тип
            $("#deadline-input").val(deadline); // Срок выполнения
            $("#task_description_textarea").val(task_description); // Инструкция

            // Магазины
            for (var i = 0; i < selected_stores.length; i++) {
                $('option[class|=selected-stores][value|=' + selected_stores[i]['store_id'] + ']').attr("selected", "selected");
            }
            selectStore();

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
    var task_id = this.id.split('_')[1]; // Получаем id задачи из атрибута id кнопки

    $("#select-store").empty(); // Очищаем <select> для выбора магазинов
    $("#select-marketer").empty(); // Очищаем <select> для выбора исполнителей

    taskEdit(task_id); // Функция редактирования
})
