<?php
require_once('db.conf.php'); // Подключаемся к БД через mysqli
require_once ('db.php'); // Подключаемся к БД через PDO
require_once('settings.php');

// Добавляем реализацию
function setImplement($task_id, $marketer_id, $store_id, $status_id)
{
    try {
        $t = 'implements';
        $v = array(
            'task_id' => $task_id,
            'marketer_id' => $marketer_id,
            'store_id' => $store_id,
            'status_id' => $status_id
        );

        $sql = SQL::getInstance()->Insert($t, $v);
        $response = $sql;
    }
    catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $response;
}

// Получаем реализации

function getImplements($task_id){
    try {
        // Подготовленное выражение
        $q = "SELECT implements.created_at, marketers.name AS marketer_name,
        stores.name AS store_name, status_name
        FROM implements 
        LEFT JOIN marketers ON implements.marketer_id = marketers.id
        LEFT JOIN stores ON implements.store_id = stores.id
        LEFT JOIN task_statuses ON implements.status_id = task_statuses.status_id
        WHERE task_id = " . $task_id;

        $sql = SQL::getInstance()->Select($q); // Обращение к БД
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $sql;
}


// Добавляем или редактируем задачу
function setTask($task_id = 0){
    $response = '';

    // Добавляем данные в таблицу tasks
    try {
        $t = 'tasks';
        $v = array(
            'task_title' => $_POST['task_title'],
            'type_id' => $_POST['task_type_id'],
            'deadline' => $_POST['deadline'],
            'author' => 'менеджер',
            'task_description' => $_POST['task_description']
        );

        // Если Id задачи больше 0, значит задача редактируется
        if($task_id > 0) {
            $w = "task_id =" . $task_id; // Id редактируемой задачи
            // Обращаемся к БД
            $sql = SQL::getInstance()->Update($t, $v, $w);
            $response = $task_id;
        }

        // Иаче добавляем новую задачу
        else {
            $sql = SQL::getInstance()->Insert($t, $v);
            $task_id = $sql;
            $response = $sql;
        }

        // Если задача редактируется, удаляем предыдущих пользователей
        if($task_id > 0){
            $table = 'task_marketers';
            $where = "task_id = " . $task_id;
            $sql = SQL::getInstance()->Delete($table, $where);
        }

        // Добавляем данные в таблицу task-marketers
        $t= 'task_marketers';
        $marketers_count = count($_POST['marketer']);

        for ($i=0; $i<$marketers_count; $i++){
            $v = array(
                'task_id' => $task_id,
                'marketer_id' => $_POST['marketer'][$i],
            );
            SQL::getInstance()->Insert($t, $v);
        }

        // Если задача редактируется, удаляем предыдущие магазины
        if($task_id > 0){
            $table = 'task_stores';
            $where = "task_id = " . $task_id;
            $sql = SQL::getInstance()->Delete($table, $where);
        }

        // Добавляем данные в таблицу task-marketers
        $t = 'task_stores';
        $marketers_count = count($_POST['store']);

        for ($i=0; $i<$marketers_count; $i++){
            $v = array(
                'task_id' => $task_id,
                'store_id' => $_POST['store'][$i],
            );
            SQL::getInstance()->Insert($t, $v);
        }

    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }

    return $response;
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

function getTasksByDate($date){

    try {
        // Подготовленное выражение
        $q = "SELECT * FROM tasks
            WHERE deadline = '" . $date."'";

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
        LEFT JOIN task_types ON tasks.type_id = task_types.task_type_id
        WHERE task_id = " . $task_id;
        $sql = SQL::getInstance()->Select($q); // Обращение к БД
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $sql;
}

function getTaskCreateAndDisplayDate($task_id){
    try {
        // Подготовленное выражение
        $q = "SELECT created_at, first_display FROM tasks
        WHERE task_id = " . $task_id;
        $sql = SQL::getInstance()->Select($q); // Обращение к БД
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $sql;
}

function deleteTask($task_id){
    $response = '';
    $task_id = (int)$task_id;

    // Удаляем задачу из таблицы tasks
    try{
        $table = 'tasks';
        $where = "task_id = " . $task_id;
        $sql = SQL::getInstance()->Delete($table, $where);
        $response = 'Задача удалена';
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }

    // Удаляем магазины из таблицы task_stores
    try{
        $table = 'task_stores';
        $where = "task_id = " . $task_id;
        $sql = SQL::getInstance()->Delete($table, $where);
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }

    // Удаляем иполнителей из таблицы task_marketers
    try{
        $table = 'task_marketers';
        $where = "task_id = " . $task_id;
        $sql = SQL::getInstance()->Delete($table, $where);
    }
    catch(PDOException $e){
        die("Error: ".$e->getMessage());
    }

    return $response;
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

// Данные таблицы task_statuses
function getStatuses(){
    try {
        // Подготовленное выражение
        $q = "SELECT * FROM task_statuses";
        $sql = SQL::getInstance()->Select($q);
    } catch (PDOException $e) {
        die("Error: " . $e->getMessage());
    }
    return $sql;
}

