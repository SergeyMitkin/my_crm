$(document).ready(function () {
    // При нажатии кнопки "Создать задачу", показываем форму
    $("#task-create-form-button").on('click', function () {
        // var elCreateFormButton = document.getElementById('task-create-form-button'); // Кнопка "Создать задачу"
        var elCreateForm = document.getElementById('task-create-form'); // Форма создания задачи

        elCreateForm.removeAttribute("hidden");
    })
})