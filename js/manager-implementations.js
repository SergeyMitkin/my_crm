// Выводим список реализаций
function implementsList(task_id){
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
            task_id: task_id
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function (data) {

            var obj = jQuery.parseJSON(data); // Получаем данные задачи

            // Создаём элементы вывода статистики
            var d_i = document.createElement("div");
            d_i.id = "div-implements_" + task_id;
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
        },
    });

    // ajax-запрос для поучения списка реализаций

    var url = "auth.php";
    var action = "getImplements";
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
            var div_implements_id = "div-implements_" + task_id;
            var elDivImplements = document.getElementById(div_implements_id);

            var elOlTitleP = document.createElement("p");
            elOlTitleP.classList = "col-md-12";
            var elTaskImplementOl = document.createElement("ol");
            elTaskImplementOl.classList= "col-md-12 implements-ol";

            var li = '';
            // Помещаем в <li> реализации
            for (var i = 0; i < obj.length; i++) {
                li += '<li class="col-md-12 implement-li" id="implement-li_' + + obj[i]['implement_id'] + '">' +
                    'Магазин: ' + obj[i]['store_name'] + '</br>' +
                    'Исполнитель: ' +obj[i]['marketer_name'] + '</br>' +
                    'Статус: ' + obj[i]['status_name'] + '</br>' +
                    'Дата: ' + obj[i]['created_at']
                '</li>';
                if (obj[i]['status_id'] == 4){
                    if (obj[i]['is_covered'] == 0){
                        li += '</br><button class="button-cover-implement" id="button-cover-implement_' + obj[i]['implement_id'] + '">Подтвердить выполнение</button>'
                    }else {
                        li += '</br><u>Выполнение подтверждено</u>'
                    }
                }
            }

            elTaskImplementOl.innerHTML = li;
            elDivImplements.appendChild(elOlTitleP);
            elOlTitleP.textContent = "Реализации: "
            elDivImplements.appendChild(elTaskImplementOl);

            // P "Cкрыть"
            var p_close = document.createElement("p");
            p_close.textContent = "Скрыть";
            p_close.classList = "p-close";
            elDivImplements.appendChild(p_close);

            elTaskDiv.appendChild(elDivImplements);

            var elCoverButtons = document.querySelectorAll(".button-cover-implement");
            elCoverButtons.forEach( elem => {
                elem.addEventListener('click', event =>{
                coverImplement(elem.attributes["id"].value.split("_")[1])
               })
            })

            // P "Скрыть"
            // Прикрепляем к параграфу функцию скрытия списка реализаций
            addEvent(p_close, 'click', function (e) {
                // Делаем активной кнопку "Реализации"
                var implements_button_id = "task-statement-button_" + task_id;
                var elImplementsButton = document.getElementById(implements_button_id);
                elImplementsButton.removeAttribute("disabled");

                // Очищаем div со списком реализаций
                elTaskDiv.removeChild(elDivImplements);
            })
        }
    })
}

// Выводим список реализаций задачи
$(".task-statement-button").on('click', function () {
    var task_id = this.id.split('_')[1]; // Получаем id задачи из id кнопки

    $(this).attr("disabled", true);

    implementsList(task_id);
})

function coverImplement(implement_id) {

    // ajax-запрос
    var action = "coverImplement";

    $.ajax({
        url: 'auth.php',
        type: "POST",
        data: {
            ajax: action,
            implement_id: implement_id,
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function (response) {
            var implement_li_item = "implement-li_" + implement_id;
            var elImplementLiItem = document.getElementById(implement_li_item);

            var implement_cover_button = "button-cover-implement_" + implement_id;
            var elImplementButton = document.getElementById(implement_cover_button);

            var elSpanIsCovered = document.createElement("u");
            elSpanIsCovered.textContent = "Выполнение подтверждено";

            elImplementLiItem.replaceChild(elSpanIsCovered, elImplementButton);

        }
    });
}

