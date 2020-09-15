<?php
foreach ($retailpoint_data as $retailpoint) {
    echo '<option value="' . $retailpoint['id'] . '">'
        . $retailpoint['name'] . '</option>';
}
?>

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTaskStatuses'){
$task_id = $_GET['task_id'];
$marketers = $_GET['marketers'];
//$statuses = getTaskStatuses($task_id, 1);
//$tasks = getTaskMarketers($task_id);
echo json_encode(count($_GET['marketers']));
}
// Получаем статусы задачи
function getTaskStatuses(id) {

// ajax-запрос для получения исполнителей задачи

// var url = "tasks.php";
//var action = "getTaskMarketers";

return jQuery.ajax({
type: "GET",
url: "tasks.php",
data: {
ajax: "getTaskMarketers",
task_id: id
},
})
.done(function (response) {
//console.log(response);
var obj = jQuery.parseJSON(response);
console.log(obj);

return jQuery.ajax({
type: "GET",
url: "tasks.php",
data: {
ajax: "getTaskStatuses",
marketers: obj,
task_id: id
},
}).done(function (data) {
console.log(data)
})
// return response;
})


//console.log(marketers);

/*
var url = "tasks.php";
var action = "getTasks";

$.ajax({
url: url,
type: "GET",
data: {
ajax: action,
},
error: function () {
alert('Что-то пошло не так!');
},
success: function (response) {
var obj = jQuery.parseJSON(response);

}
})
*/
}

function getTaskStatuses($task_id, $marketer_id){
try {
$q = "SELECT `status` from taskimplementations where task_id = " . $task_id . " AND marketer_id = " . $marketer_id . " order by created_at desc limit 1";
$sql = SQL::getInstance()->Select($q);
}
catch(PDOException $e){
die("Error: ".$e->getMessage());
}

return $sql;
}

SELECT distinct marketer_id FROM taskimplementations WHERE task_id = 323
SELECT `status` from taskimplementstions where task_id = 323 AND user_id = 1 order by created_at desc limit 1

/*
(SELECT marketer_id FROM taskimplementations AS t GROUP BY marketer_id HAVING COUNT( marketer_id ) > 1)


<?php
if (!empty($tasks)){
    foreach($tasks as $task){
        echo
            '<div id="div-task-span_'.$task['id'].'" class="div-task-span col-md-12"
                                data-toggle="modal" data-target="#taskModal"
                                >'.
            '<span id="task-span_'.$task['id'].'" class="task-span col-md-6" value="'.$task['id'].'">'.$task['task_title'].'</span>' .
            '</div>'
        ;
    }
} else {
    echo '';
}
?>

// Прикрепляем функцию редактирования
var elEditButtons = document.querySelectorAll(".task-edit-button");
elEditButtons.forEach( elem => {
elem.addEventListener('click', event =>{
taskEdit(elem.attributes["id"].value.split("_")[1])
})
})

// Прикрепляем функцию удаления
var elDeleteButtons = document.querySelectorAll(".task-delete-button");
elDeleteButtons.forEach( elem => {
elem.addEventListener('click', event =>{
taskDelete(elem.attributes["id"].value.split("_")[1])
})
})

// Прикрепляем функцию вывода списка реализаций
var elTaskDiv = document.querySelectorAll(".div-task-span");
elTaskDiv.forEach( elem => {
elem.addEventListener('click', event =>{

if (!event.currentTarget.classList.contains("imp-open")) {
// Список не выводится, если кликнули на кнопку или на P
if (event.target.tagName !== "BUTTON") {
if (event.target.tagName !== "P") {
implementationList(elem.attributes["id"].value.split("_")[1]);
}
}
}
})
})

<?php
if (!empty($tasks)){
    foreach($tasks as $task){

        echo '<div id="div-task-span_'. $task['id'] .'" class="div-task-span imp-close col-md-12"
                                     data-filter-type="' . $task['type'] . '"
                                     data-filter-date="' . substr($task['deadline'], 0, 10) . '"
                                     data-filter-status="';

        echo getTaskStatuses($task['id']);

        echo '" data-filter-marketer="';

        foreach (getSelectedMarketers($task['id']) as $marketer){
            echo ' ' . $marketer['marketer_id'] . ' ';
        }

        echo '" data-filter-retailpoint="';

        foreach (getSelectedRetailpoints($task['id']) as $retailpoint){
            echo ' ' . $retailpoint['retailpoint_id'] . ' ';
        }

        echo '"> <span id="task_span_' . $task['id'] .
            '" class="task-span col-md-4" value="' . $task['id'] .
            '">' . $task['task_title'] . '</span>                          
                                     <div id="task-edit-buttons_' . $task['id'] . '" align="right">
                                        <button type="button" class="btn btn-primary task-edit-button"
                                                id="edit-task-button_' . $task['id'] . '">Редактировать</button>
                                        <button type="button" class="btn btn-danger task-delete-button"
                                                id="delete-task-button_' . $task['id'] . '">Удалить</button>
                                    </div>
                                </div>';
    }
}else{
    echo '';
}
?>
