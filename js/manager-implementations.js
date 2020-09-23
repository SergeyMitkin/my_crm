// Выводим список реализаций
function implementationList(task_id){
    // Div задачи
    var div_task_span_id = "div-task-span_" + task_id;
    var elTaskDiv = document.getElementById(div_task_span_id)

    // Делаемнекликабельным div задачи
    elTaskDiv.classList.remove("imp-close");
    elTaskDiv.classList.add("imp-open");

    var elTaskEditButton = document.getElementById("edit-task-button_" + task_id);
    elTaskEditButton.setAttribute("disabled", "");
    var elTaskDeleteButton = document.getElementById("delete-task-button_" + task_id);
    elTaskDeleteButton.setAttribute("disabled", "");

    // ajax-запрос для получения данных задачи
    var url = "tasks.php";
    var action = "getTaskCreateAndDisplayDate";
    $.ajax({
        url: url,
        type: "GET",
        data: {
            ajax: action,
            id: task_id
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function (data) {

            var obj = jQuery.parseJSON(data); // Получаем данные задачи

            // Создаём элементы вывода статистики
            elTaskDiv.innerHTML +=
                '<div id="div-implementations_' + task_id + '" class="col-md-12 imp-open">'
                + '<p>Создана: <span>' + obj[0]['created_at'] + '</span></p>'
                + '<p>Первое отображение: <span>' + obj[0]['first_display'] + '</span></p>'
                + '</div>';

            // ajax-запрос для поучения списка реализаций
            var url = "tasks.php";
            var action = "getImplementations";
            $.ajax({
                url: url,
                type: "GET",
                data: {
                    ajax: action,
                    task_id: task_id
                },
                error: function () {
                    alert('Что-то пошло не так!');
                },
                success: function (data) {
                    var obj = jQuery.parseJSON(data); // Получаем данные таблицы реализаций

                    // Создаём элементы для вывода списка реализаций
                    var elDivImplementations = document.getElementById("div-implementations_" + task_id);

                    var elOlTitleP = document.createElement("p");
                    elOlTitleP.classList = "col-md-12";
                    var elTaskImplementationOl = document.createElement("ol");
                    elTaskImplementationOl.classList= "col-md-12 implementations-ol";

                    var li = '';
                    // Помещаем в <li> реализации
                    for (var i = 0; i < obj.length; i++) {

                        var status_colour = '';

                        switch (obj[i]['status']) {

                            case 'Новая':
                                status_colour = 'implementation-new';
                                break;

                            case 'Требует пояснения':
                                status_colour = 'implementation-clarification';
                                break;

                            case 'Принята':
                                status_colour = 'implementation-accepted';
                                break;

                            case 'Выполнена':
                                status_colour = 'implementation-completed';
                        }

                        li += '<li class="col-md-12 implementation-li '+ status_colour +'" id="implementation-li_' + + obj[i]['id'] + '">' +
                            'Магазин: ' + obj[i]['retailpoint_name'] + '</br>' +
                            'Исполнитель: ' +obj[i]['marketer_name'] + '</br>' +
                            'Статус: ' + obj[i]['status'] + '</br>' +
                            'Дата: ' + obj[i]['created_at']
                        '</li>';
                        if (obj[i]['status'] == 'Выполнена'){
                            if (obj[i]['is_covered'] == 0){
                                li += '</br><button class="button-cover-implementation" id="button-cover-implementation_' + obj[i]['id'] + '">Подтвердить выполнение</button>'
                            }else {
                                li += '</br><u>Выполнение подтверждено</u>'
                            }
                        }
                    }

                    elTaskImplementationOl.innerHTML = li;
                    elDivImplementations.appendChild(elOlTitleP);
                    elOlTitleP.textContent = "Реализации: "
                    elDivImplementations.appendChild(elTaskImplementationOl);

                    // Кнопка "Cкрыть"
                    var b_close = document.createElement("button");
                    b_close.textContent = "Скрыть";
                    elDivImplementations.appendChild(b_close);

                    elTaskDiv.appendChild(elDivImplementations);

                    var elCoverButtons = document.querySelectorAll(".button-cover-implementation");
                    elCoverButtons.forEach( elem => {
                        elem.addEventListener('click', event =>{
                        coverImplementation(elem.attributes["id"].value.split("_")[1])
                        })
                    })

                    // Прикрепляем функцию скрытия списка реализаций
                    addEvent(b_close, 'click', function () {

                        // Очищаем div со списком реализаций
                        elTaskDiv.classList.remove("imp-open");
                        elTaskDiv.classList.remove("lightgreen-hover");
                        elTaskDiv.classList.add("imp-close");

                        // Прикрепляем функцию редактирования
                        var elEditButton = document.getElementById("edit-task-button_" + task_id);
                        elEditButton.removeAttribute("disabled");
                        elEditButton.addEventListener('click', event =>{
                            taskEdit(task_id)
                        })

                        // Прикрепляем функцию удаления
                        var elDeleteButton = document.getElementById("delete-task-button_" + task_id);
                        elDeleteButton.removeAttribute('disabled');
                        elDeleteButton.addEventListener('click', event =>{
                            taskDelete(task_id)
                        })

                        // Прикрепляем функцию скрытия формы редактирования
                        var elButtonClose = document.querySelector(".close-button");
                        elButtonClose.addEventListener('click', event =>{
                                var elDivTaskSpan = document.getElementById("div-task-span_" + task_id);
                            if (elDivTaskSpan.classList.contains("imp-open")){
                                elDivTaskSpan.classList.add("imp-close");
                                elDivTaskSpan.classList.remove("imp-open");
                            }

                            $("#div-task-create-form").attr("hidden", "");
                        })

                        elTaskDiv.removeChild(elDivImplementations);
                    })
                }
            })
        },
    });

    elTaskDiv.classList.remove("imp-close");
    if (elTaskDiv.classList.contains("task-completed")){
        elTaskDiv.classList.add("lightgreen-hover");
    }
}

// Менеджер подтверждает выполнение задачи
function coverImplementation(id) {

    // ajax-запрос
    var action = "coverImplementation";

    $.ajax({
        url: 'tasks.php',
        type: "POST",
        data: {
            ajax: action,
            id: id,
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function () {
            var implementation_li_item = "implementation-li_" + id;
            var elImplementationLiItem = document.getElementById(implementation_li_item);

            var implementation_cover_button = "button-cover-implementation_" + id;
            var elImplementationButton = document.getElementById(implementation_cover_button);

            var elSpanIsCovered = document.createElement("u");
            elSpanIsCovered.textContent = "Выполнение подтверждено";

            elImplementationLiItem.replaceChild(elSpanIsCovered, elImplementationButton);
        }
    });
}

