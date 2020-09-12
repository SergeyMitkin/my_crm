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



