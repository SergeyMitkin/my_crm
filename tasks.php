<?php
require_once('models/m_tasks.php');
require_once ('db.php'); // Подключаемся к БД через PDO

$tasks = getTasks();

// Создаём задачу
if (isset($_POST['ajax']) && $_POST['ajax'] == 'taskCreate'){

    $id = $_POST['id'];
    $task_title = $_POST['task_title'];
    $type = $_POST['task_type'];
    $deadline = $_POST['deadline'];
    $author = 'менеджер';
    $task_description = $_POST['task_description'];

    $marketer_array = $_POST['marketer'];
    $retailpoint_array = $_POST['retailpoint'];

    $last_inserted_task_id = setTask($id, $task_title, $type, $deadline, $author, $task_description, $marketer_array, $retailpoint_array);
    if ($last_inserted_task_id !== false){
        $last_inserted_task = getTask($last_inserted_task_id);
        echo json_encode($last_inserted_task);
    }
}

if (isset($_POST['ajax']) && $_POST['ajax'] == 'changeStatus'){
    $task_id = $_POST['task_id'];
    $marketer_id = $_POST['marketer_id'];
    $retailpoint_id = $_POST['retailpoint_id'];
    $status = $_POST['status'];

    echo json_encode(setImplementation($task_id, $marketer_id, $retailpoint_id, $status));
}

if (isset($_POST['ajax']) && $_POST['ajax'] == 'taskDelete'){
    $id = $_POST['id'];
    $response = deleteTask($id);
    echo json_encode($response);
}

if (isset($_POST['ajax']) && $_POST['ajax'] == 'coverImplementation'){
    $id = $_POST['id'];
    $response = coverImplementation($id);
    echo json_encode($response);
}

// Получаем исполнителей
function getMarketers(){
    try {
        $q = "SELECT id, `name` FROM marketers";
        $sql = SQL::getInstance()->Select($q);
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }
    return $sql;
}

// Получаем магазины
function getRetailpoints(){
    try {
        $q = "SELECT id, `name` FROM retailpoints";
        $sql = SQL::getInstance()->Select($q);
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }
    return $sql;
}

$marketer_data = getMarketers();
$retailpoint_data = getRetailpoints();

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTaskCreateAndDisplayDate'){
    $id = $_GET['id'];
    $task_data = getTaskCreateAndDisplayDate($id);

    echo json_encode($task_data);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getImplementations'){
    $task_id = $_GET['task_id'];
    $task_data = getImplementations($task_id);

    echo json_encode($task_data);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTask'){
    $response = array();
    $id = $_GET['id'];

    $task_data = getTask($id);
    $selected_retailpoints = getSelectedRetailpoints($id);
    $selected_marketers = getSelectedMarketers($id);
    array_push($response, $task_data, $retailpoint_data, $selected_retailpoints, $marketer_data, $selected_marketers);
    echo json_encode($response);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTasksByDate'){
    $date = $_GET['date'];
    $tasks = getTasksByDate($date);
    echo json_encode($tasks);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTasksByMarketer'){
    $marketer_id = $_GET['marketer_id'];
    $tasks = getTasksByMarketer($marketer_id);
    echo json_encode($tasks);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTaskStatuses'){
    $task_id = $_GET['task_id'];
    $marketers = $_GET['marketers'];

    if(is_array($marketers) && !empty($marketers)){
        $statuses = getTaskStatuses($task_id, 1);
//$tasks = getTaskMarketers($task_id);
        echo json_encode(count($_GET['marketers']));
    }


}


if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTaskMarketers'){
    $task_id = $_GET['task_id'];
    $tasks = getTaskMarketers($task_id);
    echo json_encode($tasks);
}


if (isset($_GET['ajax']) && $_GET['ajax'] == 'getTasks'){
    $tasks = getTasks();
    echo json_encode($tasks);
}

if (isset($_GET['ajax']) && $_GET['ajax'] == 'getMarketers'){
    $marketers = getMarketers();
    echo json_encode($marketers);
}