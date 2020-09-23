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
            url: 'tasks.php',
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

                var obj = jQuery.parseJSON(response)[0]; // Данные новой задачи

                var title = obj['task_title'];
                var type = obj['type'];
                var deadline = obj['deadline'].substr(0, 10);

                var elDivTaskCreateForm = document.getElementById("div-task-create-form"); // Div с формой создания задачи
                elDivTaskCreateForm.setAttribute("hidden", ""); // Скрываем форму создания задачи

                // Если задача редактировалась выводим новые данные
                if (id>0){
                    $("#task_span_" + id).text(title);
                    $("#task-type_" + id).text(type);
                    $('#task-deadline_' + id).text(deadline);

                    var selectedMarketerNames = getSelectedMarketerNames(id);
                    var selectedRetailpointNames = getSelectedRetailpointNames(id);
                }
                // Если создана новая, помещаем её в конец списка
                else {

                    var task_id = obj['id'];
                    // Создаём атрибуты для вывода новой задачи
                    var elTaskRow = document.getElementById("tasks-row");

                    elTaskRow.innerHTML += '<div id="div-task-span_' + task_id
                        + '" class="div-task-span imp-close col-md-12"'
                        + ' data-filter-type="' +  type
                        + '" data-filter-date="' + deadline
                        + '" data-filter-status=""'
                        + '" data-filter-marketer=""'
                        + '" data-filter-retailpoint=""'
                        + '">'
                        + '<span id="task_span_' + task_id
                        + '" class="task-span col-md-4" value="' + task_id
                        + '">' + title
                        + '</span>'
                        + '</br>'
                        + '<span class="col-md-6">Тип: <span id="task-type_' + task_id + '">' + type + '</span></span>'
                        + '</br>'
                        + '<p class="col-md-12">Исполнители: <span id="selected-marketer-names_' + task_id + '"></span></p>'
                        + '</br>'
                        + '<p class="col-md-12">Магазины: <span id="selected-retailpoint-names_' + task_id + '"></span></p>'
                        + '</br>'
                        + '<span class="col-md-6">Срок выполнения: <span id="task-deadline_' + task_id + '">' + deadline + '</span></span>'
                        + '<div class="col-md-12" id="task-edit-buttons_' + task_id
                        + '" align="right">'
                        + '<button type="button" class="btn btn-primary task-edit-button"'
                        + ' id="edit-task-button_' + task_id
                        + '">Редактировать</button>'
                        + '<button type="button" class="btn btn-danger task-delete-button"'
                        + ' id="delete-task-button_' + task_id
                        + '">Удалить</button>'
                        +'</div>'
                        +'</div>';

                    var selectedRetailpointNames = getSelectedRetailpointNames(task_id);
                    var selectedMarketerNames = getSelectedMarketerNames(task_id);

                    var data_status_string = getTaskStatuses(task_id);
                    var data_retailpoint_string = getSelectedRetailpoints(task_id);
                    var data_marketer_string = getSelectedMarketers(task_id);

                    var is_completed = isCompleted(task_id);

                    // Прикрепляем к кнопке функцию редактирования
                    var elLastTaskEditButton = document.getElementById("edit-task-button_" + task_id);
                    addEvent(elLastTaskEditButton, 'click', function (e) {
                        //var task_id = obj['id'];
                        taskEdit(task_id);
                    })

                    // Прикрепляем к кнопке функцию удаления
                    var elLastTaskDeleteButton = document.getElementById("delete-task-button_" + task_id);
                    addEvent(elLastTaskDeleteButton, 'click', function (e) {
                        //var task_id = obj['id'];
                        taskDelete(task_id);
                    })

                    // По клику на задачу, выводим статистику
                    var elLastTaskDiv = document.getElementById("div-task-span_" + task_id);
                    elLastTaskDiv.addEventListener("click", function () {
                        if (!event.currentTarget.classList.contains("imp-open")) {
                            if (event.target.tagName !== "BUTTON") {
                                implementationList(task_id);
                            }
                        }
                    })
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