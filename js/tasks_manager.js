$(document).ready(function () {
    // При нажатии кнопки "Создать задачу", показываем форму
    $("#task-create-form-button").on('click', function () {

        var elManagerTaskPage = document.getElementById("manager-task-page") // Страница с задачами
        var elCreateForm = document.getElementById('div-task-create-form'); // Форма создания задачи
        elManagerTaskPage.appendChild(elCreateForm);

        elCreateForm.removeAttribute("hidden"); // Показываем форму

        $('#task-create-form')[0].reset(); // Очищаем значения инпутов формы
        $('#form-create-task_id').val(0); // Id задачи устанавливаем 0

        var elTypeSelect = document.getElementById("task-type-select");
        var type_options = '<option class="task-type-option" value="type_1">type 1</option>\n' +
                            '<option class="task-type-option" value="type_2">type 2</option>\n' +
                            '<option class="task-type-option" value="type_3">type 3</option>\n' +
                            '<option class="task-type-option" value="type_4">type 4</option>'
        elTypeSelect.innerHTML = type_options;

        $("#select-retailpoint").val(''); // Очищаем <select> для выбора магазинов
        $("#select-marketer").val(''); // Очищаем <select> для выбора исполнителей

        selectRetailpoint(); // Множественный выбор магазинов
        selectMarketer(); // Множественный выбор исполнителей
    })
})

// Создаём или редактируем задачу
$(document).ready(function() {
    var elCreateTaskForm = document.getElementById("task-create-form"); // Форма создания задачи
    selectRetailpoint();
    selectMarketer();

    addEvent(elCreateTaskForm, 'submit', function (e) {
        e.preventDefault(); // Останавливаем отправку
        var elements = this.elements; // Элементы формы
        var id = elements.id.value; // Id задачи
        var task_title = elements.task_title.value; // Краткое описание
        var selected_type_option = elements.task_type.selectedIndex;
        var task_type = elements.task_type.options[selected_type_option].textContent; // Тип задачи
        var deadline = elements.deadline.value; // Срок исполнения

        var retailpoint = $("#select-retailpoint").val(); // Получаем массив с id выбранных магазинов
        var marketer = $("#select-marketer").val(); // Получаем массив с id выбранных пользователей
        var task_description = elements.task_description.value; // Инструкция по выполнению

        var action = "taskCreate"
        $.ajax({
            url: 'auth.php',
            type: "POST",
            data: {
                ajax: action,
                id: id,
                task_title: task_title,
                task_type: task_type,
                deadline: deadline,
                retailpoint: retailpoint,
                marketer: marketer,
                task_description: task_description
            },
            error: function () {
                alert('Что-то пошло не так!');
            },
            success: function (response) {
                var elDivTaskCreateForm = document.getElementById("div-task-create-form"); // Div с формой создания задачи
                elDivTaskCreateForm.setAttribute("hidden", ""); // Скрываем форму создания задачи

                // Создаём атрибуты для вывода новой задачи
                var elTaskRow = document.getElementById("tasks-row");
                var elLastTaskDiv = document.createElement("div"); // Div для новой задачи
                var elLastTaskSpan = document.createElement("span"); // Выводим имя задачи
                var elDivTaskEditButtons = document.createElement("div");


                var obj = jQuery.parseJSON(response)[0]; // Данные новой задачи

                // Если задача редактировалась выводим новое описание задачи
                if (id>0){
                    var task_span_id = "task_span_" + id;
                    document.getElementById(task_span_id).textContent = obj['task_title'];
                }
                // Если создана новая, помещаем её в конец списка
                else {
                    // Добавляем атрибуты в div новой задачи
                    var last_task_div_id = "div-task-span_" + obj['id'];
                    elLastTaskDiv.setAttribute("id", last_task_div_id);
                    elLastTaskDiv.setAttribute("class", "div-task-span col-md-12");
                    var selected_marketers_string = ' ' + marketer.join(' ') + ' ';
                    elLastTaskDiv.setAttribute("data-filter-marketers", selected_marketers_string);
                    var selected_retailpoints_string = ' ' + retailpoint.join(' ') + ' ';
                    elLastTaskDiv.setAttribute("data-filter-retailpoint", selected_retailpoints_string);
                    elLastTaskDiv.setAttribute("data-filter-type", obj['type']);
                    var task_filter_date = obj['deadline'].substr(0, 10);
                    elLastTaskDiv.setAttribute("data-filter-date", task_filter_date);

                    console.log(obj['type']);

                    // Добавляем атрибуты для span с кратким описанием последней добавленной задачи
                    var created_task_id = "task_span_" + obj['id'];
                    elLastTaskSpan.setAttribute("value", obj['id']);
                    elLastTaskSpan.setAttribute("class", "task-span col-md-4");
                    elLastTaskSpan.setAttribute("id", created_task_id);
                    elLastTaskSpan.textContent = obj['task_title'];

                    // Добавляем кнопку "Редактировать"
                    var div_edit_buttons_id = "task-edit-buttons_" + obj['id'];
                    elDivTaskEditButtons.setAttribute("id", div_edit_buttons_id);
                    elDivTaskEditButtons.setAttribute("align", "right");

                    var elLastTaskEditButton = document.createElement("button");
                    elLastTaskEditButton.setAttribute("type", "button");
                    elLastTaskEditButton.setAttribute("class", "btn btn-primary task-edit-button");
                    var editButtonId = "edit-task-button_" + obj['id'];
                    elLastTaskEditButton.setAttribute("id", editButtonId);
                    elLastTaskEditButton.textContent = "Редактировать";

                    // Прикрепляем к кнопке функцию редактирования
                    addEvent(elLastTaskEditButton, 'click', function (e) {
                        var task_id = obj['id'];
                        taskEdit(task_id);
                    })

                    // Добавляем кнопку "Удалить"
                    var elLastTaskDeleteButton = document.createElement("button");
                    elLastTaskDeleteButton.setAttribute("type", "button");
                    elLastTaskDeleteButton.setAttribute("class", "btn btn-danger task-delete-button");
                    var deleteButtonId = "delete-task-button_" + obj['id'];
                    elLastTaskDeleteButton.setAttribute("id", deleteButtonId);
                    elLastTaskDeleteButton.textContent = "Удалить";

                    // Прикрепляем к кнопке функцию удаления
                    addEvent(elLastTaskDeleteButton, 'click', function (e) {
                        var task_id = obj['id'];
                        taskDelete(task_id);
                    })

                    elDivTaskEditButtons.appendChild(elLastTaskEditButton);
                    elDivTaskEditButtons.appendChild(elLastTaskDeleteButton);

                    elLastTaskDiv.appendChild(elLastTaskSpan);
                    elLastTaskDiv.appendChild(elDivTaskEditButtons);

                    // По клику на задачу, выводим статистику
                    elLastTaskDiv.addEventListener("click", function () {
                        console.log(event.currentTarget.classList);
                        if (!event.currentTarget.classList.contains("imp-open")) {
                            if (event.target.tagName !== "BUTTON") {
                                if (event.target.tagName !== "P") {
                                    implementationList(obj['id']);
                                }
                            }
                        }

                    })
                    elTaskRow.appendChild(elLastTaskDiv);
                }
            },
            complete: function () {
                // После выполнения запроса, выводим информацию о добавлении задачи
                if (id>0){
                    alert("Задача отредактирована");
                } else
                {
                    alert("Задача добавлена");
                }
            }
        })
    })
})

// Функция множественного выбора в <select>
function multiselect() {
    $("#checkbox-retailpoint").click(function(){
        if($("#checkbox-retailpoint").is(':checked') ){
            $("#select-retailpoint > option").prop("selected","selected");// Select All Options
            $("#select-retailpoint").trigger("change");// Trigger change to select 2
        }else{
            $("#select-retailpoint > option").removeAttr("selected");
            $("#select-retailpoint").trigger("change");// Trigger change to select 2
        }
    });

    $("#checkbox-marketer").click(function(){
        if($("#checkbox-marketer").is(':checked') ){
            $("#select-marketer > option").prop("selected","selected");// Select All Options
            $("#select-marketer").trigger("change");// Trigger change to select 2
        }else{
            $("#select-marketer > option").removeAttr("selected");
            $("#select-marketer").trigger("change");// Trigger change to select 2
        }
    });
}

// Множественный выбор магазинов
function selectRetailpoint(){
    $("#select-retailpoint").select2();
    multiselect();
    $("#select-retailpoint").select2({
        placeholder: "Выберите магазин", //placeholder
        tags: true,
        tokenSeparators: ['/',',',';'," "],
    });
}

// Множественный выбор иполнителей
function selectMarketer(){
    $("#select-marketer").select2();
    multiselect();
    $("#select-marketer").select2({
        placeholder: "Выберите исполнителя", //placeholder
        tags: true,
        tokenSeparators: ['/',',',';'," "],
    });
}