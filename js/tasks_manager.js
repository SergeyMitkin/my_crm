$(document).ready(function () {
    // При нажатии кнопки "Создать задачу", показываем форму
    $("#task-create-form-button").on('click', function () {
        // var elCreateFormButton = document.getElementById('task-create-form-button'); // Кнопка "Создать задачу"
        var elCreateForm = document.getElementById('task-create-form'); // Форма создания задачи

        elCreateForm.removeAttribute("hidden");
    })
})

// Выбор нескольких или всех магазинов
$(document).ready(function(){
$("#select-store").select2();
$("#checkbox-store").click(function(){
    if($("#checkbox-store").is(':checked') ){
        $("#select-store > option").prop("selected","selected");// Select All Options
        $("#select-store").trigger("change");// Trigger change to select 2
    }else{
        $("#select-store > option").removeAttr("selected");
        $("#select-store").trigger("change");// Trigger change to select 2
    }
});

$("#button").click(function(){
    alert($("#select-store").val());
});

    $("#select-store").select2({
        placeholder: "Выберите магазин", //placeholder
        tags: true,
        tokenSeparators: ['/',',',';'," "],
    });
})

// Выбор нескольких или всех исполнителей
$(document).ready(function(){
$("#select-marketer").select2();
$("#checkbox-marketer").click(function(){
    if($("#checkbox-marketer").is(':checked') ){
        $("#select-marketer > option").prop("selected","selected");// Select All Options
        $("#select-marketer").trigger("change");// Trigger change to select 2
    }else{
        $("#select-marketer > option").removeAttr("selected");
        $("#select-marketer").trigger("change");// Trigger change to select 2
    }
});

$("#button").click(function(){
    alert($("#select-marketer").val());
});

    $("#select-marketer").select2({
        placeholder: "Выберите исполнителя", //placeholder
        tags: true,
        tokenSeparators: ['/',',',';'," "],
    });
})

// Множественный выбор в <select>
/*
$(document).ready(function () {
   $(".mul-select").select2({
       placeholder: "Ваберите исполнителя",
       tags: true,
       tokenSeparators: ['/', ',', ',', " "]
   })
})
*/