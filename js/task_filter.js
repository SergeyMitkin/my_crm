var filterBox = document.querySelectorAll(".div-task-span");

function onTypeSelectionChange(select) {
    var selectedOption = select.options[select.selectedIndex].value;
    var filterClass = 'filter-type_' + selectedOption;

    filterBox.forEach( elem => {
        elem.classList.remove('hide');
       if(!elem.classList.contains(filterClass) && selectedOption !== 'all'){
           elem.classList.add('hide');
    }
    });
}

function onMarketerSelectionChange(select) {
    var selectedOption = select.options[select.selectedIndex].value;


    $("#manager-task-raw").empty(); // Очищаем div с задачами

    getTasksByMarketer(selectedOption); // Получаем задачи на определённую дату
}

// Получаем задачи по дате
function getTasksByMarketer(marketer_id) {

    // ajax-запрос для получения данных выбранной задачи
    var url = "auth.php";

    if (marketer_id == 'all'){
        var action = "getTasks";
    } else {
        var action = "getTasksByMarketer";
    }

    $.ajax({
        url: url,
        type: "GET",
        data: {
            ajax: action,
            marketer_id: marketer_id,
        },
        error: function () {
            alert('Что-то пошло не так!');
        },
        success: function (response) {
            var obj = jQuery.parseJSON(response); // Задачи

            // Выводим задачи на страницу
            var d = document.getElementById("manager-task-raw");
            var d_t = document.createElement("div");
            var s = document.createElement("span");
            var b_r = document.createElement("button");
            b_r.type="button";
            var d_b = document.createElement("div");
            var b_e = document.createElement("button");
            b_e.type="button";
            var b_d = document.createElement("button")
            b_d.type="button";

            d_b.appendChild(b_e);
            d_b.appendChild(b_d);

            d_t.appendChild(s);
            d_t.appendChild(b_r);
            d_t.appendChild(d_b);

            s.classList="task-span col-md-4";
            d_b.classList = "col-md-4";
            b_r.classList="btn btn-secondary col-md-2 task-statement-button";
            b_e.classList="btn btn-primary task-edit-button";
            b_d.classList="btn btn-danger task-delete-button";

            b_r.textContent = 'Реализации';
            b_e.textContent = 'Редактировать';
            b_d.textContent = 'Удалить';

            for (var i = 0; i < obj.length; i++) {
                //var task_id = obj[i]['task_id']
                d_t.id="div-task-span_" + obj[i]['task_id'];
                d_t.classList="div-task-span col-md-12 filter-type_" + obj[i]['type_id'];
                s.textContent=obj[i]['task_title'];
                s.id="task-span_" + obj[i]['task_id'];
                d_b.id="task-edit-buttons_" + obj[i]['task_id'];
                b_e.id="edit-task-button_" + obj[i]['task_id'];
                b_d.id="delete-task-button_" + obj[i]['task_id'];
                d.appendChild(d_t.cloneNode(true));
            }
            var buttonDeleteItems = document.querySelectorAll('.task-delete-button');
            var buttonEditItems = document.querySelectorAll('.task-edit-button');

            for (let buttonDeleteItem of buttonDeleteItems) {
                buttonDeleteItem.addEventListener('click', (event) =>
                taskDelete(buttonDeleteItem.id.split('_')[1])
                )
            }

            for (let buttonEditItem of buttonEditItems) {
                buttonEditItem.addEventListener('click', (event) =>
                taskEdit(buttonEditItem.id.split('_')[1])
                )
            }
        }
    })
}
