// Выводим данные задачи в модальном окне
$(document).ready(function () {

    function getTaskValues(e) {

    }


// Список задач
    var taskRow = document.getElementById("marketer-tasks-row");

// При клике на задачу, вызываем фукцию подставляющую переменные в модальное окно с карточкой задачи
    taskRow.addEventListener('click', function (e) {
        getTaskValues(e);
    }, true);
})