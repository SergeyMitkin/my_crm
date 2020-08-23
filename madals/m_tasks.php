<?php
require_once('db.conf.php'); // Подключаемся к БД через mysqli
require_once ('db.php'); // Подключаемся к БД через PDO
require_once('settings.php');

// Добавляем или задачу
function setTask(){
    $response = '';

    // Добавляем данные в таблицу tasks
    try {
        $t = 'tasks';
        $v = array(
            'task_title' => $_POST['task_title'],
            'type_id' => $_POST['task_type_id'],
            'deadline' => $_POST['deadline'],
            'author' => 'менеджер',
            'status_id' => 1,
            'task_description' => $_POST['task_description']
        );
        $sql = SQL::getInstance()->Insert($t, $v);

        // Добавляем данные в таблицу task-marketers
        $t= 'task_marketers';
        $marketers_count = count($_POST['marketer']);

        for ($i=0; $i<$marketers_count; $i++){
            $v = array(
                'task_id' => $sql,
                'marketer_id' => $_POST['marketer'][$i],
            );
            SQL::getInstance()->Insert($t, $v);
        }

        // Добавляем данные в таблицу task-marketers
        $t = 'task_stores';
        $marketers_count = count($_POST['store']);

        for ($i=0; $i<$marketers_count; $i++){
            $v = array(
                'task_id' => $sql,
                'store_id' => $_POST['store'][$i],
            );
            SQL::getInstance()->Insert($t, $v);
        }

    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }

    return $sql;
}

// Получаем типы задач
function getTaskTypes(){
    try {
        $q = "SELECT * FROM task_types";
        $sql = SQL::getInstance()->Select($q);
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }

    return $sql;
}

$task_types_data = getTaskTypes();

// Получаем список задач
function getTasks(){
    // Получаем данные задач на странице из БД
    try {
        // Подготовленное выражение
        $q = "SELECT * FROM tasks";
        $sql = SQL::getInstance()->Select($q); // Обращение к БД
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $sql;
}

function getTask($task_id){
    try {
        // Подготовленное выражение
        $q = "SELECT * FROM tasks 
        LEFT JOIN task_statuses ON tasks.status_id = task_statuses.status_id
        LEFT JOIN task_types ON tasks.type_id = task_types.task_type_id
        WHERE task_id = " . $task_id;
        $sql = SQL::getInstance()->Select($q); // Обращение к БД
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $sql;
}

// Функция выбора исполнителей задачи
function getSelectedMarketers($task_id){
    try {
        // Подготовленное выражение
        $q = "SELECT marketer_id FROM task_marketers WHERE task_id = " . $task_id;
        $sql = SQL::getInstance()->Select($q);
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $sql;
}

// Функция выбора магазинов задачи
function getSelectedStores($task_id){
    try {
        // Подготовленное выражение
        $q = "SELECT store_id FROM task_stores WHERE task_id = " . $task_id;
        $sql = SQL::getInstance()->Select($q);
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $sql;
}

