// Выводим список реализаций
function implementationList(task_id){
    // Div задачи
    var div_task_span_id = "div-task-span_" + task_id;
    var elTaskDiv = document.getElementById(div_task_span_id);

    // ajax-запрос для получения данных задачи
    var url = "auth.php";
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
            var d_i = document.createElement("div");
            d_i.id = "div-implementations_" + task_id;
            d_i.classList = "col-md-12";

            var p_c_a = document.createElement("p");
            var s_c_a = document.createElement("span");
            p_c_a.textContent = "Создана: "
            p_c_a.appendChild(s_c_a);
            s_c_a.textContent = obj[0]['created_at'];

            var p_f_d = document.createElement("p");
            var s_f_d = document.createElement("span");
            p_f_d.textContent = "Первое отображение: "
            p_f_d.appendChild(s_f_d);
            s_f_d.textContent = obj[0]['first_display'];

            d_i.appendChild(p_c_a);
            d_i.appendChild(p_f_d);

            elTaskDiv.appendChild(d_i);
            elTaskDiv.classList.add("imp-open");
            elTaskDiv.classList.remove("imp-close");
        },
    });

    // ajax-запрос для поучения списка реализаций

    var url = "auth.php";
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
            var div_implementations_id = "div-implementations_" + task_id;
            var elDivImplementations = document.getElementById(div_implementations_id);

            var elOlTitleP = document.createElement("p");
            elOlTitleP.classList = "col-md-12";
            var elTaskImplementationOl = document.createElement("ol");
            elTaskImplementationOl.classList= "col-md-12 implementations-ol";

            var li = '';
            // Помещаем в <li> реализации
            for (var i = 0; i < obj.length; i++) {
                li += '<li class="col-md-12 implementation-li" id="implementation-li_' + + obj[i]['id'] + '">' +
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

            // P "Cкрыть"
            var p_close = document.createElement("p");
            p_close.textContent = "Скрыть";
            p_close.classList = "p-implementation-close";
            elDivImplementations.appendChild(p_close);

            elTaskDiv.appendChild(elDivImplementations);

            var elCoverButtons = document.querySelectorAll(".button-cover-implementation");
            elCoverButtons.forEach( elem => {
                elem.addEventListener('click', event =>{
                coverImplementation(elem.attributes["id"].value.split("_")[1])
               })
            })

            // P "Скрыть"
            // Прикрепляем к параграфу функцию скрытия списка реализаций
            addEvent(p_close, 'click', function (e) {

                // Очищаем div со списком реализаций
                elTaskDiv.removeChild(elDivImplementations);
                elTaskDiv.classList.remove("imp-open");
                elTaskDiv.classList.add("imp-close");
            })
        }
    })
}

// Выводим список реализаций задачи
$(".div-task-span").on('click', function () {
    var task_id = this.id.split('_')[1]; // Получаем id задачи из id кнопки

    if (!event.currentTarget.classList.contains("imp-open")) {
        if (event.target.tagName !== "BUTTON") {
            if (event.target.tagName !== "P") {
                implementationList(task_id);
            }
        }
    }
})

// менеджер подтверждает выполнение задачи
function coverImplementation(id) {

    // ajax-запрос
    var action = "coverImplementation";

    $.ajax({
        url: 'auth.php',
        type: "POST",
        data: {
            ajax: action,
            id: id,
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function (response) {
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

